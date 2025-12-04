import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

cartSchema.index({ userId: 1 });

export interface ICartItem {
  productId: string;
  quantity: number;
  note?: string;
}

export interface ICart extends mongoose.Document {
  _id: string;
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<ICart>('Cart', cartSchema);
