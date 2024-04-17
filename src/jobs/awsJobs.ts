import { SQSClientConfig } from "@aws-sdk/client-sqs";
import { sqsUtils } from "../utils/awsUtils/sqsUtils";
import { SqsService } from "../services/sqs";
import { logEvents } from "../middleware/log-events";
import { Location } from "../schemas/location-schema";
import { LocationService } from "../services/location/location";
import schedule from "node-schedule";

export class awsJobs {
  /**
   * This function will periodically take in the last 10 location-created messages and
   * creates them into the database
   */
  static async batchProcessSQSLocationMsgs(
    config: SQSClientConfig,
    queueName: string,
    queryInterval: number
  ) {
    const cronExpression = `*/${String(queryInterval)} * * * *`;

    schedule.scheduleJob(cronExpression, async () => {
      console.log("Running the batch process job...");
      try {
        const queueUrl = sqsUtils.retrieveQueueUrl(queueName);
        console.log("Queue URL: ", queueUrl);

        // Retrieve the last 10 messages from the queue
        const messages = await SqsService.recieveQueueMessage(
          config,
          queueUrl,
          {
            attributeNames: ["All", "ApproximateNumberOfMessages"],
            maxNumberOfMessages: 10,
            waitTimeSeconds: 0,
          }
        );

        // Log the messages if there are no messages in the queue
        if (!messages || !messages.Messages || messages.Messages.length === 0) {
          const errorMessge = "There were no messages found in the queue";
          logEvents(`test_error\t${errorMessge}`, "errors_test.txt");
          throw new Error(errorMessge);
        }

        console.log("These are the locations: ", messages.Messages);

        messages.Messages?.forEach(async (msg) => {
          const messageBody = JSON.parse(msg.Body as string);
          const resource: string = messageBody.Message;
          const JSONLocation: Location = JSON.parse(resource);

          await LocationService.createLocation(
            JSONLocation.locationUserEmail,
            JSONLocation
          );
        });

        // Delete messages from the queue
        await SqsService.batchDeleteQueueMessages(
          config,
          queueUrl,
          messages.Messages
        );
      } catch (error) {
        console.error("Error in batchProcessSQSLocationMsgs: ", error);
      }
    });
  }
}
