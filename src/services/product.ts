import { Sequelize, QueryTypes } from "sequelize";
import "dotenv/config";
import { BadRequestError } from "@craftyverse-au/craftyverse-common";

type Product = {
  locationId: string;
  name: string;
  description: string;
  createdAt: string;
  deletedAt: string | null;
};

export class ProductService {
  /**
   * This function creates a product in the database.
   * @param product
   * @returns {Model<any, any>}
   */
  static async createProduct(product: Product): Promise<[number, number]> {
    const dbInstance = new Sequelize(`${process.env.POSTGRES_CONNECTION_URI}`);
    const storedProduct = await dbInstance.query(
      `INSERT INTO product (
        'locationId',
        'name',
        'description',
        'createdAt',
        'deletedAt'
      ) values (
        '${product.locationId}',
        '${product.name}',
        '${product.description}',
        '${product.createdAt}',
        '${product.deletedAt}'
      )
        RETURNING *;`,
      { type: QueryTypes.INSERT }
    );

    if (!storedProduct) {
      throw new BadRequestError("Could not create product");
    }

    return storedProduct;
  }

  static async getProductById(productId: string) {}
}
