import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    phoneKey: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ phoneKey: 1 });

export interface IOtp extends mongoose.Document {
  _id: string;
  phoneKey: string;
  otp: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<IOtp>('Otp', otpSchema);