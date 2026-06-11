import otpModel, { IOtp } from '../models/otp.model';

export interface ICreateOtpParams {
  email: string;
  otp: string;
  expiresAt: Date;
}

export class OtpRepository {
  private _model = otpModel;

  async createOtp(params: ICreateOtpParams): Promise<IOtp> {
    return this._model.create({
      email: params.email,
      otp: params.otp,
      expiresAt: params.expiresAt,
    });
  }

  async getLatestOtp(email: string): Promise<IOtp | null> {
    return this._model
      .findOne({ email })
      .sort({ createdAt: -1 });
  }

  async markUsed(id: string): Promise<void> {
    await this._model.findByIdAndUpdate(id, { isUsed: true });
  }
}
