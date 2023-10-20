import mongoose from "mongoose";
import { app } from "./app";
import redisClient from "./services/redis-service";
import {
  BadRequestError,
  NotFoundError,
  awsSnsClient,
  awsSqsClient,
  imageEventVariables,
  imageQueueVariables,
  locationEventVariables,
  locationQueueVariables,
} from "@craftyverse-au/craftyverse-common";
import { awsConfig } from "./config/aws-config";
import { SQSClientConfig } from "@aws-sdk/client-sqs";

const start = async () => {
  // ======================= env validation ===========================
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

  // ======================= Getting message topics ===========================
  const getlocationCreatedTopicArn =
    await awsSnsClient.getFullTopicArnByTopicName(
      awsConfig,
      locationEventVariables.LOCATION_CREATED_EVENT
    );

  const getImageuploadedTopicArn =
    await awsSnsClient.getFullTopicArnByTopicName(
      awsConfig,
      imageEventVariables.IMAGE_UPLOADED_EVENT
    );

  // ======================= Getting queue arns ===========================
  const locationCreatedQueueArn = await awsSqsClient.getQueueArnByUrl(
    awsConfig as SQSClientConfig,
    `${process.env.LOCALSTACK_HOST_URL}/${locationQueueVariables.LOCATION_CREATED_QUEUE}`
  );

  const imageUploadedQueueArn = await awsSqsClient.getQueueArnByUrl(
    awsConfig as SQSClientConfig,
    `${process.env.LOCALSTACK_HOST_URL}/${imageQueueVariables.IMAGE_UPLOADED_QUEUE}`
  );

  if (!getlocationCreatedTopicArn || !getImageuploadedTopicArn) {
    throw new NotFoundError("Could not find event message");
  }

  // ======================= Subscribing to topics ===========================
  const subscribeToTopicResponse = await awsSnsClient.subscribeToTopic(
    awsConfig,
    {
      topicArn: getlocationCreatedTopicArn,
      protocol: "sqs",
      endpoint: locationCreatedQueueArn,
    }
  );

  const subscribeToimageUploadRespnse = await awsSnsClient.subscribeToTopic(
    awsConfig,
    {
      topicArn: getImageuploadedTopicArn,
      protocol: "sqs",
      endpoint: imageUploadedQueueArn,
    }
  );

  console.log("The location created topic is subscribed");
  console.log("The image upload topic is subscribed");

  if (!subscribeToTopicResponse || !subscribeToimageUploadRespnse) {
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
