import mongoose from 'mongoose';

export enum DealerStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      maxLength: 40,
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 40,
    },
    email: {
      type: String,
      trim: true,
      minLength: 2,
    },
    buisnessName: {
      type: String,
      trim: true,
      maxLength: 80,
    },
    isdCode: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 10,
    },
    phoneNumber: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 40,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: DealerStatus,
      default: DealerStatus.PENDING,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ isdCode: 1, phoneNumber: 1 }, { unique: true });

export interface IUser extends mongoose.Document {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  buisnessName?: string;
  isdCode: string;
  phoneNumber: string;
  gstNumber?: string;
  city?: string;
  state?: string;
  status: DealerStatus;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<IUser>('User', userSchema);