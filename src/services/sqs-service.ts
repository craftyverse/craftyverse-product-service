import {
  SQSClient,
  SQSClientConfig,
  ListQueuesCommand,
  ListQueuesCommandInput,
  ListQueueTagsCommandOutput,
  ListQueuesCommandOutput,
  CreateQueueCommand,
  CreateQueueCommandInput,
  CreateQueueCommandOutput,
  GetQueueAttributesCommand,
  GetQueueAttributesCommandInput,
  GetQueueAttributesCommandOutput,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
  ReceiveMessageCommandOutput,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { NotFoundError } from "@craftyverse-au/craftyverse-common";

export const awsSqsClient = (() => {
  let sqsClient: SQSClient;

  const createSqsClient = (config: SQSClientConfig): SQSClient => {
    if (!sqsClient) {
      sqsClient = new SQSClient(config);
    }

    return sqsClient;
  };

  const listAllSqsQueues = async (
    config: SQSClientConfig,
    params: {
      queueNamePrefix: string;
      maxResults: number;
    }
  ): Promise<ListQueueTagsCommandOutput> => {
    const sqsClient = createSqsClient(config);

    const listAllQueuesParams: ListQueuesCommandInput = {
      QueueNamePrefix: params.queueNamePrefix,
      MaxResults: params.maxResults,
    };

    const listAllQueuesCommand = new ListQueuesCommand(listAllQueuesParams);

    const listAllQueuesResponse = await sqsClient.send(listAllQueuesCommand);

    return listAllQueuesResponse;
  };

  const getQueueArnByUrl = async (
    config: SQSClientConfig,
    queueUrl: string
  ): Promise<string> => {
    const sqsClient = createSqsClient(config);

    const getQueueParams: GetQueueAttributesCommandInput = {
      QueueUrl: queueUrl,
      AttributeNames: ["QueueArn"],
    };

    const getQueueCommand = new GetQueueAttributesCommand(getQueueParams);

    const getQueueResponse = await sqsClient.send(getQueueCommand);

    return getQueueResponse.Attributes!.QueueArn;
  };

  const createSqsQueue = async (
    config: SQSClientConfig,
    queueName: string,
    attributes: {
      delaySeconds: string;
      messageRetentionPeriod: string; // 7 days
      receiveMessageWaitTimeSeconds: string;
    }
  ): Promise<CreateQueueCommandOutput | string> => {
    const sqsClient = createSqsClient(config);

    const createSqsQueueParams: CreateQueueCommandInput = {
      QueueName: queueName,
      Attributes: {
        DelaySeconds: attributes.delaySeconds,
        MessageRetentionPeriod: attributes.messageRetentionPeriod,
        ReceiveMessageWaitTimeSeconds: attributes.receiveMessageWaitTimeSeconds,
      },
    };

    const queuesList: ListQueuesCommandOutput = await listAllSqsQueues(config, {
      queueNamePrefix: queueName,
      maxResults: 10,
    });

    console.log("queues in aws: ", queuesList);

    if (!queuesList || !queuesList.QueueUrls) {
      throw new NotFoundError("no queues defined");
    }

    const queueNameMatch = queuesList.QueueUrls.find((url) =>
      url.includes(queueName)
    );

    if (queueNameMatch) {
      return "Queue name already exists";
    }

    const createSqsQueueCommand = new CreateQueueCommand(createSqsQueueParams);

    const createSqsQueueResponse: GetQueueAttributesCommandOutput =
      await sqsClient.send(createSqsQueueCommand);
    console.log("This is the response: ", createSqsQueueResponse);

    return createSqsQueueResponse;
  };

  const receiveQueueMessage = async (
    config: SQSClientConfig,
    queueUrl: string,
    params: {
      attributeNames: string[];
      maxNumberOfMessages?: number;
      waitTimeSeconds?: number;
      visibilityTimeout?: number;
    }
  ) => {
    const sqsClient = createSqsClient(config);

    const receiveQueueMessageParams: ReceiveMessageCommandInput = {
      QueueUrl: queueUrl,
      AttributeNames: params.attributeNames,
      MaxNumberOfMessages: params.maxNumberOfMessages,
      WaitTimeSeconds: params.waitTimeSeconds,
      VisibilityTimeout: params.visibilityTimeout,
    };

    const receiveQueueMessageCommand = new ReceiveMessageCommand(
      receiveQueueMessageParams
    );

    const receiveQueueMessageResponse: ReceiveMessageCommandOutput =
      await sqsClient.send(receiveQueueMessageCommand);

    return receiveQueueMessageResponse;
  };

  const deleteQueueMessage = async (
    config: SQSClientConfig,
    queueUrl: string,
    receiptHandle: string
  ) => {
    const sqsClient = createSqsClient(config);

    const deleteQueueMessageParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    };

    const deleteQueueMessageCommand = new DeleteMessageCommand(
      deleteQueueMessageParams
    );

    const deleteQueueMessageResponse = await sqsClient.send(
      deleteQueueMessageCommand
    );

    return deleteQueueMessageResponse;
  };

  return {
    createSqsClient,
    listAllSqsQueues,
    createSqsQueue,
    getQueueArnByUrl,
    receiveQueueMessage,
    deleteQueueMessage,
  };
})();
