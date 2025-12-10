import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            requried: true,
            trim: true,
            maxLength: 60,
        },
         description: {
            type: String,
            trim: true,
        },
        image: {
            type: String, // URL of category banner / icon
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps : true }
)

categorySchema.index({ name: 1 });

export interface ICategory extends mongoose.Document {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export default mongoose.model<ICategory>('Category', categorySchema);