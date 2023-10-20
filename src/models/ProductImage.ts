import mongoose from "mongoose";

export interface ProductImageFields {
  productImageFileName: string;
  productImageFileOriginalName: string;
  productImageDescription: string;
  productImageProductName: string;
}

export interface ProductImageModel
  extends mongoose.Model<ProductImageDocument> {
  build(fields: ProductImageFields): ProductImageDocument;
}

export interface ProductImageDocument extends mongoose.Document {
  productImageFileName: string;
  productImageFileOriginalName: string;
  productImageDescription: string;
  productImageProductName: string;
}

const productImageSchema = new mongoose.Schema(
  {
    productImageFileName: { type: String, required: true },
    productImageFileOriginalName: { type: String, required: true },
    productImageDescription: { type: String, required: true },
    productImageProductName: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

productImageSchema.statics.build = (fields: ProductImageFields) => {
  return new ProductImage(fields);
};

const ProductImage = mongoose.model<ProductImageDocument, ProductImageModel>(
  "ProductImage",
  productImageSchema
);

export { ProductImage };
