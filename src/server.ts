import { app } from "./app";
import { Sequelize } from "sequelize";
import "dotenv/config";

const PORT = process.env.PORT;
const POSTGRES_CONNECTION_URI = process.env.POSTGRES_CONNECTION_URI;
const PRODUCT_CREATED_TOPIC = process.env.PRODUCT_CREATED_TOPIC;

const server = async () => {
  const sequelize = new Sequelize(`${POSTGRES_CONNECTION_URI}`);

  // Establish database connection
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  // Listing SNS topics

  app.listen(PORT, () => {
    console.log(`V1 product-service is running on port ${PORT}`);
  });
};

server();
