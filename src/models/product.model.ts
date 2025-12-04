import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        sku: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        categoryId: {
            type: String,
        },
        images: [
            {
                type: String,
            }
        ],
        weight: {
            type: Number,
        },
        purity: {
            type: String,
        },
        makingChargesPerGram: {
            type: Number,
        },
        isActive: {
            type: Boolean,
            default: true
        },
    }, { timestamps: true }
);

productSchema.index({ isActive: 1 });

export interface IProduct extends mongoose.Document {
    _id: string;
    name: string;
    sku?: string;
    description?: string;
    categoryId?: string;
    images: string[];
    weight?: number;
    purity?: string;
    makingChargesPerGram?: number;
    isActive: boolean;
}

export default mongoose.model<IProduct>('Product', productSchema);