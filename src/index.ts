import mongoose from "mongoose";
import { app } from "./app";
import redisClient from "./services/redis-service";
import { natsWrapper } from "./services/nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not supplied.");
  }

  if (!process.env.LOCATION_DATABASE_MONGODB_URI) {
    throw new Error("LOCATION_DATABASE_MONGODB_URI is not supplied");
  }

  if (!process.env.REDIS_PASSWORD) {
    console.log(process.env.REDIS_PASSWORD);
  }

  if (!process.env.NATS_CLIENT_ID) {
    console.log(process.env.NATS_CLIENT_ID);
  }

  if (!process.env.NATS_URL) {
    console.log(process.env.REDIS_PASSWORD);
  }

  if (!process.env.NATS_CLUSTER_ID) {
    console.log(process.env.NATS_CLUSTER_ID);
  }

  redisClient.ping();

  try {
    natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    console.log("connecting to mongodb...");
    await mongoose.connect(process.env.LOCATION_DATABASE_MONGODB_URI as string);
    console.log("connected to mongodb :)");
  } catch (error) {
    console.log("There is an error in connecting to mongoDb");
    console.error(error);
  }

  app.listen(5010, () => {
    console.log("listening on port 4000");
  });
};

start();
