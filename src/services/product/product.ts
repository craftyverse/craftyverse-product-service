import { Sequelize, QueryTypes } from "sequelize";
import "dotenv/config";
import { BadRequestError } from "@craftyverse-au/craftyverse-common";

type Product = {
  locationId: string;
  name: string;
  description: string;
  createdAt: string;
  deletedAt: string | null;
  updatedAt: string | null;
};

export class ProductService {
  /**
   * This function creates a product in the database.
   * @param product
   * @returns {any}
   */
  static async createProduct(product: Product): Promise<any> {
    const dbInstance = new Sequelize(`${process.env.POSTGRES_CONNECTION_URI}`);
    try {
      const [results, metadata] = await dbInstance.query(
        `INSERT INTO product (
        "locationId",
        "name",
        "description",
        "createdAt",
        "deletedAt",
        "updatedAt"
      ) VALUES (
        '${product.locationId}',
        '${product.name}',
        '${product.description}',
        '${product.createdAt}',
        '${product.deletedAt}',
        '${product.updatedAt}'
      )
        RETURNING *;`
      );
      return results;
    } catch (error) {
      return "Error in inserting product";
    }
  }

  static async getProductById(productId: string) {}
}
