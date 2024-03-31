import { app } from "./app";
import { Sequelize } from "sequelize";
import "dotenv/config";
import { awsConfig, snsTopicArns, sqsQueueUrls } from "../config/aws-config";
import { awsUtil } from "./utils/awsUtils/awsUtil";
import { SnsService } from "./services/sns";
import { SqsService } from "./services/sqs";
import { NotFoundError } from "@craftyverse-au/craftyverse-common";
import { sqsUtils } from "./utils/awsUtils/sqsUtils";

const PORT = process.env.PORT;
const POSTGRES_CONNECTION_URI = process.env.POSTGRES_CONNECTION_URI;
const LOCATION_CREATED_TOPIC = process.env.LOCATION_CREATED_TOPIC;

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
  const snsTopics = await awsUtil.listAllSnsTopics(awsConfig);
  console.log("These are all the topic arns: ", snsTopics);

  // Listing SQS queues
  const sqsQueues = await sqsUtils.listAllSqsQueueUrls(awsConfig);
  console.log("These are all the queue urls: ", sqsQueues);

  //Subscribing SQS queues to SNS topics
  const subscription = await sqsUtils.subscribeQueueToTopic(
    awsConfig,
    "location-created-queue:url",
    "location-created"
  );

  console.log(subscription);

  app.listen(PORT, () => {
    console.log(`V1 product-service is running on port ${PORT}`);
  });
};

server();
