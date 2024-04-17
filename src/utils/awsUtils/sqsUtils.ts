import { SNSClientConfig } from "@aws-sdk/client-sns";
import {
  awsConfig,
  awsConfigUtils,
  snsTopicArns,
  sqsQueueUrls,
} from "../../../config/aws-config";
import { NotFoundError } from "@craftyverse-au/craftyverse-common";
import { SnsService } from "../../services/sns";
import { SQSClientConfig } from "@aws-sdk/client-sqs";
import { SqsService } from "../../services/sqs";
import { Location } from "../../schemas/location-schema";

export class sqsUtils {
  /**
   * This utility function lists all the available SQS queues.
   * @param {SNSClientConfig} config
   */
  static listAllSqsQueueUrls = async (
    config: SQSClientConfig
  ): Promise<Record<string, string>> => {
    const sqsQueues = await SqsService.listAllSqsQueues(config);
    const sqsQueueUrlList = sqsQueues.QueueUrls;

    if (!sqsQueueUrlList) {
      throw new NotFoundError("No queue Urls found");
    }

    sqsQueueUrlList.forEach(async (queueUrl) => {
      const queueUrlNameBit = queueUrl.split("/");
      const queueName = queueUrlNameBit[queueUrlNameBit.length - 1];

      await awsConfigUtils.saveSqsQueueUrls(`${queueName}:url`, queueUrl);
    });

    return sqsQueueUrls;
  };

  /**
   * This utility function retrieved the queue name.
   * @param {string} queueName
   */
  static retrieveQueueUrl = (queueName: string): string => {
    if (sqsQueueUrls[`${queueName}:url`]) {
      return sqsQueueUrls[queueName];
    }
    return "No queue found";
  };

  /**
   * This utility function subscribes a queue to a topic.
   * @param config
   * @param queueName
   * @param topicName
   */
  static subscribeQueueToTopic = async (
    config: SNSClientConfig,
    queueName: string,
    topicName: string
  ): Promise<Record<string, string>> => {
    const locationCreatedQueue = await SqsService.getQueueAttributes(config, {
      queueUrl: sqsQueueUrls[`${process.env.LOCATION_CREATED_QUEUE}:url`],
      attributeNames: ["QueueArn"],
    });

    const locationCreatedQueueArn = locationCreatedQueue.Attributes?.QueueArn;
    if (!locationCreatedQueueArn) {
      throw new NotFoundError("Queue Arn not found");
    }

    const subscribeOutput = await SnsService.subscribeQueueToTopic(config, {
      topicArn: snsTopicArns[topicName],
      protocol: "sqs",
      endpoint: locationCreatedQueueArn,
    });

    console.log(subscribeOutput);

    return {
      message: `Queue ${queueName} subscribed to topic ${topicName}`,
      subscriptionArn: subscribeOutput.SubscriptionArn!,
    };
  };

  /**
   * This function retrieves messages according to the message resource id.
   * Note: The resource id is specific to the message being extracted.
   * E.g. It will look for the locationId if it is provided as a parameter
   * @param resourceId
   */
  static filterMessageByLlocationId = async (
    locationId: string,
    queueName: string
  ): Promise<
    | {
        location: Location | undefined;
        receiptHandle: string | undefined;
      }
    | undefined
  > => {
    let foundResource: {
      location: Location | undefined;
      receiptHandle: string | undefined;
    };
    const queueUrl = sqsUtils.retrieveQueueUrl(queueName);
    const messages = await SqsService.recieveQueueMessage(awsConfig, queueUrl, {
      attributeNames: ["All", "ApproximateNumberOfMessages"],
      maxNumberOfMessages: 10,
      waitTimeSeconds: 0,
    });

    if (!messages || !messages.Messages || messages.Messages.length === 0) {
      throw new NotFoundError("No location created message found.");
    }

    messages.Messages.forEach((message) => {
      const messageBody = JSON.parse(message.Body as string);
      const resource: string = messageBody.Message;
      const receiptHandle = message.ReceiptHandle as string;
      const JSONLocation = JSON.parse(resource);

      if (JSONLocation._id === locationId) {
        foundResource = {
          location: JSONLocation,
          receiptHandle,
        };
      } else {
        return undefined;
      }
    });

    return undefined;
  };
}
