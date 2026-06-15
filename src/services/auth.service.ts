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
import mailService from './mail.service';
import logger from '../utils/logger';

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

  async register(params: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isdCode: string;
    buisnessName?: string;
    city?: string;
    state?: string;
    gstNumber?: string;
  }): Promise<{ success: boolean; message: string }> {
    const email = params.email.toLowerCase().trim();

    let user = await this._userRepository.getByEmail(email);

    if (!user) {
      user = await this._userRepository.createMinimalUser({
        isdCode: params.isdCode,
        phoneNumber: params.phoneNumber,
      });
    }

    if (user.isBlocked) {
      throw new UnauthorizedError('User is blocked. Contact support');
    }

    await this._userRepository.updateDetails({
      userId: user._id,
      firstName: params.firstName,
      lastName: params.lastName,
      email,
      buisnessName: params.buisnessName,
      city: params.city,
      state: params.state,
      gstNumber: params.gstNumber,
    });

    const otp = this.generateOtp();
    await this._otpRepository.createOtp({ email, otp, expiresAt: this.getExpiryDate() });

    await mailService.sendEmail(
      email,
      'otp-verification.ejs',
      { firstName: params.firstName, otp },
      'Your Roop Jewellers verification code'
    );

    logger.info(`OTP sent to ${email}`);

    return { success: true, message: 'OTP sent to your email' };
  }

  async login(email: string): Promise<{ success: boolean; message: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await this._userRepository.getByEmail(normalizedEmail);
    if (!user) throw new NotFoundError('No account found with this email. Please sign up first.');

    if (user.isBlocked) throw new UnauthorizedError('User is blocked. Contact support');

    const otp = this.generateOtp();
    await this._otpRepository.createOtp({ email: normalizedEmail, otp, expiresAt: this.getExpiryDate() });

    await mailService.sendEmail(
      normalizedEmail,
      'otp-verification.ejs',
      { firstName: user.firstName || 'there', otp },
      'Your Roop Jewellers login code'
    );

    logger.info(`OTP sent to ${normalizedEmail}`);

    return { success: true, message: 'OTP sent to your email' };
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

  async verifyOtp(params: { email: string; otp: string }): Promise<{ status: DealerStatus; accessToken: string; message?: string }> {
    const email = params.email.toLowerCase().trim();
    const otp = params.otp;

    const user = await this._userRepository.getByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isBlocked) {
      throw new BadRequestError('User is blocked. Contact support');
    }

    const latestOtp = await this._otpRepository.getLatestOtp(email);

    if (!latestOtp) throw new BadRequestError('OTP not requested');
    if (latestOtp.isUsed) throw new BadRequestError('OTP already used');

    const now = new Date();
    if (latestOtp.expiresAt < now) throw new BadRequestError('OTP expired');

    if (latestOtp.otp !== otp) throw new UnauthorizedError('Invalid OTP');

    await this._otpRepository.markUsed(latestOtp._id);

    const token = await this.generateJWTToken(user._id);

    if (user.status !== DealerStatus.APPROVED) {
      return {
        status: user.status,
        accessToken: token,
        message: 'Your account is pending admin approval.',
      };
    }

    return {
      status: DealerStatus.APPROVED,
      accessToken: token,
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
      gstNumber: params.gstNumber,
    });

    if (!updatedUser) throw new BadRequestError('Failed to update profile');

    return updatedUser;
  }

  async adminListUsers(status?: DealerStatus): Promise<IUser[]> {
    const user = await this._userRepository.listUsers(status);

    return user;
  }

  async adminGetUserById(id: string): Promise<IUser> {
    const user = await this._userRepository.getById(id);
    if (!user) throw new NotFoundError('User not found');

    return user;
  }

  async adminUpdateStatus(userId: string, status: DealerStatus): Promise<IUser> {
    const user = await this._userRepository.updateStatus(userId, status);
    if (!user) throw new NotFoundError('User not found');

    if (status === DealerStatus.APPROVED && user.email) {
      try {
        await mailService.sendEmail(
          user.email,
          'account-approved.ejs',
          { firstName: user.firstName || 'there' },
          'Your Roop Jewellers account is approved'
        );
      } catch (err) {
        logger.error(`Failed to send approval email to ${user.email}: ${(err as Error).message}`);
      }
    }

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
