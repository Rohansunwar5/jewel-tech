import config from '../config';
import { BadRequestError } from '../errors/bad-request.error';
import { NotFoundError } from '../errors/not-found.error';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { UserRepository } from '../repository/user.repository';
import jwt from 'jsonwebtoken';
import { encode, encryptionKey } from './crypto.service';
import { encodedJWTCacheManager } from './cache/entities';
import { OtpRepository } from '../repository/otp.repository';
import { DealerStatus, IUser } from '../models/user.model';

class AuthService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _otpRepository: OtpRepository
  ) { }

  private generateOtp(): string {
    const min = 100000;
    const max = 999999;
    const value = Math.floor(Math.random() * (max - min + 1)) + min;

    return value.toString();
  }

  private getExpiryDate(): Date {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 5);

    return d;
  }

  private isDetailsFilled(user: IUser): boolean {
    if (user.firstName) return true;
    if (user.buisnessName) return true;
    if (user.email) return true;

    return false;
  }

  async requestOtp(params: { isdCode: string, phoneNumber: string }) {
    const isdCode = params.isdCode;
    const phoneNumber = params.phoneNumber;

    let user = await this._userRepository.getByPhone(isdCode, phoneNumber);

    if(!user) {
      user = await this._userRepository.createMinimalUser({ isdCode, phoneNumber });
    }

    if(!user.isBlocked) {
      throw new UnauthorizedError('User is blocked. Contact support');
    }

    const otp = this.generateOtp();
    const phoneKey = isdCode + phoneNumber;

    await this._otpRepository.createOtp({ phoneKey, otp, expiresAt: this.getExpiryDate() });

    // TODO: integrate SMS/WhatsApp provider to send OTP
    // console.log('OTP for', phoneKey, 'is', otp);

    return { success: true, message: 'OTP send successfully' };
  }

  async generateJWTToken(userId: string) {
    const token = jwt.sign({
      _id: userId.toString(),
    }, config.JWT_SECRET, { expiresIn: '24h' });

    const key = await encryptionKey(config.JWT_CACHE_ENCRYPTION_KEY);
    const encryptedData = await encode(token, key);
    await encodedJWTCacheManager.set({ userId }, encryptedData);

    return token;
  }

  async verifyOtp(params: { isdCode: string, phoneNumber: string, otp: string }): Promise<{ status: DealerStatus | 'pending_details', accessToken?: string, message?: string }> {
    const isdCode = params.isdCode;
    const phoneNumber = params.phoneNumber;
    const otp = params.otp;

    const user = await this._userRepository.getByPhone(isdCode, phoneNumber);
    if(!user) {
      throw new NotFoundError('User not found');
    }

    if(user.isBlocked) {
      throw new BadRequestError('User is blocked. Contact support');
    }

    const phoneKey = isdCode + phoneNumber;
    const latestOtp = await this._otpRepository.getLatestOtp(phoneKey);

    if(!latestOtp) throw new BadRequestError('Otp not rqeuested');
    if(latestOtp.isUsed) throw new BadRequestError('Otp already used');

    const now = new Date();
    if(latestOtp.expiresAt < now) throw new BadRequestError('Otp expired');

    if(latestOtp.otp !== otp) throw new UnauthorizedError('Invalid Otp');

    await this._otpRepository.markUsed(latestOtp._id);

    const token = await this.generateJWTToken(user._id);

    const detailsFilled = this.isDetailsFilled(user);

     if (!detailsFilled) {
      return {
        status: 'pending_details',
        accessToken: token,
        message: 'Please complete your profile details.',
      };
    }

    if (user.status !== DealerStatus.APPROVED) {
      return {
        status: user.status,
        accessToken: token,
        message: 'Your account is pending admin approval.',
      };
    }

    return {
      status: DealerStatus.APPROVED,
      accessToken: token
    };
  }

  async profile(userId: string) {
    const user = await this._userRepository.getById(userId);
    if (!user) throw new NotFoundError('User not found');

    return user;
  }

  async updateProfile(params: {
    userId: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    buisnessName?: string;
    city?: string;
    state?: string;
    gstNumber?: string;
  }) {
    const updatedUser = await this._userRepository.updateDetails({
      userId: params.userId,
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      buisnessName: params.buisnessName,
      city: params.city,
      state: params.state,
      gstNumber: params.gstNumber
    });

    if(!updatedUser) throw new BadRequestError('Failed to update profile');

    return updatedUser;
  }

  async adminListUsers(status?: DealerStatus): Promise<IUser[]> {
    const user = await this._userRepository.listUsers(status);

    return user;
  }

  async adminGetUserById(userId: string): Promise<IUser> {
    const user = await this._userRepository.getById(userId);
    if(!user) throw new NotFoundError('User not found');

    return user;
  }

  async adminUpdateStatus(userId: string, status: DealerStatus): Promise<IUser> {
    const user = await this._userRepository.updateStatus(userId, status);
    if(!user) throw new NotFoundError('User not found');

    return user;
  }

  async adminBlockUser(userId: string, isBlocked: boolean): Promise<IUser> {
    const user = await this._userRepository.blockUser(userId, isBlocked);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return user;
  }
}

export default new AuthService(new UserRepository(), new OtpRepository());