import otpModel, { IOtp } from '../models/otp.model';

export interface ICreateOtpParams {
  phoneKey: string;
  otp: string;
  expiresAt: Date;
}

export class OtpRepository {
  private _model = otpModel;

  async createOtp(params: ICreateOtpParams): Promise<IOtp> {
    return this._model.create({
      phoneKey: params.phoneKey,
      otp: params.otp,
      expiresAt: params.expiresAt,
    });
  }

  async getLatestOtp(phoneKey: string): Promise<IOtp | null> {
    return this._model
      .findOne({ phoneKey })
      .sort({ createdAt: -1 });
  }

  async markUsed(id: string): Promise<void> {
    await this._model.findByIdAndUpdate(id, { isUsed: true });
  }
}
