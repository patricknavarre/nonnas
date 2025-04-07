import mongoose from 'mongoose';

export interface IProduct {
  _id?: string;
  title: string;
  description: string;
  price: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
  category: string;
  shopifyProductId?: string;
  shopifyVariantId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, required: true }
  }],
  category: { type: String, required: true },
  shopifyProductId: { type: String },
  shopifyVariantId: { type: String },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema); 