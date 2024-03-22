import { Model } from "sequelize";
import { ProductModel } from "../../models/product";
import { Product } from "../../schemas/product-schema";
import { BadRequestError } from "@craftyverse-au/craftyverse-common";

export class ProductService {
  /**
   * This function creates a product in the database.
   * @param product
   * @returns {Model<any, any>}
   */
  static async createProduct(product: Product): Promise<Model<any, any>> {
    const createdProduct = await ProductModel.create({
      locationId: product.locationId,
      name: product.name,
      description: product.description,
      createdAt: product.createdAt,
      deletedAt: product.deletedAt,
    });

    if (!createdProduct) {
      throw new BadRequestError("Failed to create product to the database");
    }

    return createdProduct;
  }

  static async getProductById(productId: string) {}
}
