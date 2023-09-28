import mongoose from "mongoose";
import { LocationDocument } from "./Location";

interface ProductFields {
  productUserId: string;
  productLocation: LocationDocument;
  // This will change
  productCategoryId: string;
  productName: string;
  productDescription: string;
  productImageIds: string[];
}

interface ProductModel extends mongoose.Model<ProductDocument> {
  build(fields: ProductFields): ProductDocument;
}

interface ProductDocument extends mongoose.Document {
  productUserId: string;
  productLocation: LocationDocument;
  // This will change
  productCategoryId: string;
  productName: string;
  productDescription: string;
  productImageIds: string[];
}

const productSchema = new mongoose.Schema(
  {
    productUserId: { type: String, required: true },
    productLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    productCategoryId: { type: String, required: false },
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.productId = ret._id;
        delete ret._id;
      },
    },
  }
);

productSchema.statics.build = (fields: ProductFields) => {
  return new Product(fields);
};

const Product = mongoose.model<ProductDocument, ProductModel>(
  "Product",
  productSchema
);

export { Product };
