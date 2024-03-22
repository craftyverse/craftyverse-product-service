import { Sequelize, DataTypes } from "sequelize";
import "dotenv/config";
const dbInstance = new Sequelize(`${process.env.POSTGRES_CONNECTION_URI}`);

const product = dbInstance.define("product", {
  /**
   * The id of the product
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  /**
   * The id that is associated with the seller's location
   */
  locationId: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  /**
   * The name of the product
   */
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  /**
   * The description of the product
   */
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  /**
   * When the product was created
   */
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  /**
   * When the product was deleted
   */
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export { product as ProductModel };
