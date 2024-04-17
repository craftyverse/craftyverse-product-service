import { app } from "./app";
import { Sequelize } from "sequelize";
import "dotenv/config";
import { awsConfig } from "../config/aws-config";
import { snsUtils } from "./utils/awsUtils/snsUtils/snsUtil";
import { sqsUtils } from "./utils/awsUtils/sqsUtils";
import { awsJobs } from "./jobs/awsJobs";

const PORT = process.env.PORT;
const POSTGRES_CONNECTION_URI = process.env.POSTGRES_CONNECTION_URI;

const server = async () => {
  const sequelize = new Sequelize(`${POSTGRES_CONNECTION_URI}`);

  if (process.env.NODE_ENV !== "test") {
    // Establish database connection
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }

    // Listing SNS topics
    const snsTopics = await snsUtils.listAllSnsTopics(awsConfig);
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

    // Scheduler Job functions
    awsJobs.batchProcessSQSLocationMsgs(
      awsConfig,
      "location-created-queue:url",
      1
    );
  }

  app.listen(PORT, () => {
    console.log(`V1 product-service is running on port ${PORT}`);
  });
};

server();
