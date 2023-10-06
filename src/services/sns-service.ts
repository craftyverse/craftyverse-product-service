import {
  SNSClient,
  CreateTopicCommand,
  CreateTopicCommandOutput,
  ListTopicsCommand,
  PublishCommand,
  PublishCommandInput,
  PublishCommandOutput,
  SNSClientConfig,
  SubscribeCommand,
  SubscribeCommandInput,
  SubscribeCommandOutput,
} from "@aws-sdk/client-sns";
import { BadRequestError } from "@craftyverse-au/craftyverse-common";

export const awsSnsClient = (() => {
  let snsClient: SNSClient;

  /**
   * This function will generate a default AWS SNS client
   * @returns {SNSClient}
   */
  const createSnsClient = (config: SNSClientConfig): SNSClient => {
    if (!snsClient) {
      snsClient = new SNSClient(config);
    }

    return snsClient;
  };

  /**
   * This will list all of tje global sns topics
   */
  const listAllSnsTopics = async (config: SNSClientConfig) => {
    const snsClient = createSnsClient(config);
    const listTopicsParams = {};

    const listSnsTopicCommand = new ListTopicsCommand(listTopicsParams);
    const listSnsTopicsResponse = await snsClient.send(listSnsTopicCommand);
    return listSnsTopicsResponse;
  };

  /**
   * This will create a sns topic
   * @param config - The AWS credentials
   * @param topicName - Name of the desired topic name
   */
  const createSnsTopic = async (
    config: SNSClientConfig,
    topicName: string
  ): Promise<{ message: string; topicArn: string }> => {
    const snsClient = createSnsClient(config);
    const topicNameParams = {
      Name: topicName,
    };
    const extractedTopicNames: string[] = [];

    const topicList = await listAllSnsTopics(config);
    let fullTopicArn: string = "";

    if (topicList && topicList.Topics) {
      topicList.Topics.forEach((topic) => {
        const topicArn = topic.TopicArn!;
        fullTopicArn = topicArn;
        const topicArray = topicArn.split(":");
        extractedTopicNames.push(topicArray[topicArray.length - 1]);
      });
    }

    if (extractedTopicNames.find((topic) => topic === topicName)) {
      console.log("Topic name already exists!");
      return {
        message: "Topic name already exists!",
        topicArn: fullTopicArn,
      };
    }

    console.log("Full topic names: ", topicList);

    const createSnsTopicComamnd = new CreateTopicCommand(topicNameParams);

    const createSnsTopicResponse: CreateTopicCommandOutput =
      await snsClient.send(createSnsTopicComamnd);

    const snsTopicResponseString = JSON.stringify(createSnsTopicResponse);

    console.log(createSnsTopicResponse);

    return {
      message: snsTopicResponseString,
      topicArn: fullTopicArn,
    };
  };

  const getFullTopicArnByTopicName = async (
    config: SNSClientConfig,
    snsTopicName: string
  ): Promise<string | undefined> => {
    const topicList = await listAllSnsTopics(config);
    const extractedTopicArn: string[] = [];

    console.log("This is the full list of topic ARN: ", topicList);

    if (topicList && topicList.Topics) {
      topicList.Topics.forEach((topic) => {
        const topicArn = topic.TopicArn!;
        extractedTopicArn.push(topicArn);
      });
    }

    console.log(extractedTopicArn);

    const matchingTopicArn = extractedTopicArn.find((arn) => {
      return arn.includes(snsTopicName);
    });

    return matchingTopicArn;
  };

  /**
   *
   * @param message - Message that is going to be published.
   * @param topicArn - The topic that the message is going to publish to.
   */
  const publishSnsMessage = async (
    config: SNSClientConfig,
    params: {
      message: string;
      subject: string;
      topicArn: string;
      messageGroupId: string;
    }
  ): Promise<PublishCommandOutput | undefined> => {
    const snsClient = createSnsClient(config);

    const publisSnshMessageParams: PublishCommandInput = {
      Message: params.message,
      Subject: params.subject,
      TopicArn: params.topicArn,
    };

    const publishSnsMessageCommand = new PublishCommand(
      publisSnshMessageParams
    );

    const publishSnsMessageResponse: PublishCommandOutput =
      await snsClient.send(publishSnsMessageCommand);

    if (publishSnsMessageResponse.$metadata.httpStatusCode !== 200) {
      throw new BadRequestError("Failed to publish message");
    }

    return publishSnsMessageResponse;
  };

  const subscribeToTopic = async (
    config: SNSClientConfig,
    params: { topicArn: string; protocol: string; endpoint: string }
  ) => {
    const snsClient = createSnsClient(config);

    const subscribeToSnsTopicParams: SubscribeCommandInput = {
      TopicArn: params.topicArn,
      Protocol: params.protocol,
      Endpoint: params.endpoint,
    };

    const subscribeToSnsTopicCommand = new SubscribeCommand(
      subscribeToSnsTopicParams
    );

    const subscribeToSnsTopicResponse: SubscribeCommandOutput =
      await snsClient.send(subscribeToSnsTopicCommand);

    if (subscribeToSnsTopicResponse.$metadata.httpStatusCode !== 200) {
      throw new BadRequestError("Falied to subscribe to topic");
    }

    return subscribeToSnsTopicResponse;
  };

  return {
    createSnsClient,
    createSnsTopic,
    getFullTopicArnByTopicName,
    listAllSnsTopics,
    publishSnsMessage,
    subscribeToTopic,
  };
})();
