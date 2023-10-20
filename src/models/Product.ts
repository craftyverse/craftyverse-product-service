import mongoose from "mongoose";
import { LocationDocument } from "./Location";
import { ProductImageDocument } from "./ProductImage";

interface ProductFields {
  productUserId: string;
  productLocation: LocationDocument;
  // This will change to store actual productCategory service payload definitions
  productCategoryId: string;
  productName: string;
  productDescription: string;
  // This will change to store actual productImage service payload definitions
  productImages: ProductImageDocument[];

  // This will change to store actual productItem service payload definitions
  productitems: string[];
}

interface ProductModel extends mongoose.Model<ProductDocument> {
  build(fields: ProductFields): ProductDocument;
}

interface ProductDocument extends mongoose.Document {
  productUserId: string;
  productLocation: LocationDocument;
  // This will change to store an actual product category
  productCategoryId: string;
  productName: string;
  productDescription: string;
  productImages: ProductImageDocument[];
}

const productSchema = new mongoose.Schema(
  {
    productUserId: { type: String, required: true },
    productLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    productCategoryId: { type: String, required: false },
    productName: { type: String, required: true },
    productImages: { type: Array, ref: "ProductImage" },
    productDescription: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.productImageId = ret._id;
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
