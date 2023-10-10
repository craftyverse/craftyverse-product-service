import mongoose from "mongoose";
import { app } from "./app";
import redisClient from "./services/redis-service";
import {
  BadRequestError,
  NotFoundError,
  awsSnsClient,
  awsSqsClient,
} from "@craftyverse-au/craftyverse-common";
import { awsConfig } from "./config/aws-config";
import { SQSClientConfig } from "@aws-sdk/client-sqs";

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

  redisClient.ping();

  const fullTopicArn = await awsSnsClient.getFullTopicArnByTopicName(
    awsConfig,
    "location_created"
  );

  const locationCreatedQueueArn = await awsSqsClient.getQueueArnByUrl(
    awsConfig as SQSClientConfig,
    `${process.env.LOCALSTACK_HOST_URL}/location_created_queue`
  );

  if (!fullTopicArn) {
    throw new NotFoundError("Could not find event message");
  }

  const subscribeToTopicResponse = await awsSnsClient.subscribeToTopic(
    awsConfig,
    {
      topicArn: fullTopicArn,
      protocol: "sqs",
      endpoint: locationCreatedQueueArn,
    }
  );

  if (!subscribeToTopicResponse) {
    throw new BadRequestError("Cannot get subscription topic response");
  }

  try {
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
