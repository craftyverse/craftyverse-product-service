import { SNSClientConfig, SubscribeCommandOutput } from "@aws-sdk/client-sns";
import {
  awsConfigUtils,
  snsTopicArns,
  sqsQueueUrls,
} from "../../../../config/aws-config";
import { NotFoundError } from "@craftyverse-au/craftyverse-common";
import { SnsService } from "../../../services/sns";
import { SQSClientConfig } from "@aws-sdk/client-sqs";
import { SqsService } from "../../../services/sqs";

export class snsUtils {
  /**
   * This utility fucntion lists all the available SNS topics.
   * @param config
   * @returns
   */
  static listAllSnsTopics = async (
    config: SNSClientConfig
  ): Promise<Record<string, string>> => {
    const snsTopics = await SnsService.listAllSnsTopics(config);
    const topicArnList = snsTopics.Topics;

    if (!topicArnList) {
      throw new NotFoundError("No topic lists found");
    }

    topicArnList.forEach(async (topicArn) => {
      if (!topicArn.TopicArn) {
        throw new NotFoundError("No topics found");
      }
      const topicNameList = topicArn.TopicArn?.split(":");
      const topicName = topicNameList[topicNameList.length - 1];
      await awsConfigUtils.saveSnsTopicArns(`${topicName}`, topicArn.TopicArn);
    });

    return snsTopicArns;
  };
}
