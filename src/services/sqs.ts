import {
  CreateQueueCommand,
  CreateQueueCommandInput,
  CreateQueueCommandOutput,
  DeleteMessageBatchCommandInput,
  DeleteMessageBatchCommandOutput,
  DeleteMessageBatchCommand,
  DeleteMessageCommandInput,
  DeleteMessageCommandOutput,
  DeleteMessageCommand,
  GetQueueAttributesCommand,
  GetQueueAttributesCommandInput,
  ListQueuesCommand,
  QueueAttributeName,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
  SQSClient,
  SQSClientConfig,
  Message,
} from "@aws-sdk/client-sqs";
export class SqsService {
  private static sqsClient: SQSClient;

  static createSqsClient(config: SQSClientConfig): SQSClient {
    if (!SqsService.sqsClient) {
      SqsService.sqsClient = new SQSClient(config);
    }

    return SqsService.sqsClient;
  }

  static async createSqsQueue(
    config: SQSClientConfig,
    queueName: string,
    attributes: {
      delaySeconds: string;
      messageRetentionPeriod: string; // 7 days
      receiveMessageWaitTimeSeconds: string;
    }
  ): Promise<string | undefined> {
    const sqsClient = SqsService.createSqsClient(config);

    const createSqsQueueParams: CreateQueueCommandInput = {
      QueueName: queueName,
      Attributes: {
        DelaySeconds: attributes.delaySeconds,
        MessageRetentionPeriod: attributes.messageRetentionPeriod,
        ReceiveMessageWaitTimeSeconds: attributes.receiveMessageWaitTimeSeconds,
      },
    };

    console.log(createSqsQueueParams);

    const createSqsQueueCommand = new CreateQueueCommand(createSqsQueueParams);

    const createSqsQueueResponse: CreateQueueCommandOutput =
      await sqsClient.send(createSqsQueueCommand);

    // console.log(createSqsQueueResponse);

    return createSqsQueueResponse.QueueUrl;
  }

  static async listAllSqsQueues(config: SQSClientConfig) {
    const sqsClient = SqsService.createSqsClient(config);

    const listQueuesCommand = new ListQueuesCommand({});

    const listQueuesResponse = await sqsClient.send(listQueuesCommand);

    return listQueuesResponse;
  }

  static async getQueueAttributes(
    config: SQSClientConfig,
    params: { queueUrl: string; attributeNames: QueueAttributeName[] }
  ) {
    const sqsClient = SqsService.createSqsClient(config);
    const getQueueAttributesParams: GetQueueAttributesCommandInput = {
      QueueUrl: params.queueUrl,
      AttributeNames: params.attributeNames,
    };

    const getQueueAttrCommand = new GetQueueAttributesCommand(
      getQueueAttributesParams
    );

    const getQueueAttrResponse = await sqsClient.send(getQueueAttrCommand);

    return getQueueAttrResponse;
  }

  static async recieveQueueMessage(
    config: SQSClientConfig,
    queueUrl: string,
    params: {
      attributeNames: QueueAttributeName[];
      maxNumberOfMessages?: number;
      waitTimeSeconds?: number;
    }
  ) {
    const sqsClient = SqsService.createSqsClient(config);

    const receiveQueueMessageParams: ReceiveMessageCommandInput = {
      QueueUrl: queueUrl,
      AttributeNames: params.attributeNames,
      MaxNumberOfMessages: params.maxNumberOfMessages,
      WaitTimeSeconds: params.waitTimeSeconds,
    };

    const receiveQueueMessageCommand = new ReceiveMessageCommand(
      receiveQueueMessageParams
    );

    const receiveQueueMessageResponse = await sqsClient.send(
      receiveQueueMessageCommand
    );

    return receiveQueueMessageResponse;
  }

  /**
   * This function deletes a particular message from the specified SQS queue
   * @param config
   * @param resourceId
   * @param queueUrl
   * @param ReceiptHandle
   * @returns
   */
  static async deleteQueueMessageById(
    config: SQSClientConfig,
    queueUrl: string,
    receiptHandle: string
  ) {
    const sqsClient = SqsService.createSqsClient(config);
    const deleteMessageParams: DeleteMessageCommandInput = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    };

    const deleteMessageCommand: DeleteMessageCommand = new DeleteMessageCommand(
      deleteMessageParams
    );
    const response: DeleteMessageCommandOutput = await sqsClient.send(
      deleteMessageCommand
    );

    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error(
        `Failed to delete message with receiptHandle: ${receiptHandle}`
      );
    }

    return response;
  }

  static async batchDeleteQueueMessages(
    config: SQSClientConfig,
    queueUrl: string,
    messageList: Message[]
  ) {
    const sqsClient = SqsService.createSqsClient(config);

    const batchDeleteMessagesParams: DeleteMessageBatchCommandInput = {
      QueueUrl: queueUrl,
      Entries: messageList.map((message) => {
        return {
          Id: message["MessageId"],
          ReceiptHandle: message["ReceiptHandle"],
        };
      }),
    };

    const batchDeleteMessagesCommand: DeleteMessageBatchCommand =
      new DeleteMessageBatchCommand(batchDeleteMessagesParams);

    const batchDeleteMessagesResponse: DeleteMessageBatchCommandOutput =
      await sqsClient.send(batchDeleteMessagesCommand);

    console.log(batchDeleteMessagesResponse);

    return batchDeleteMessagesResponse.Successful;
  }
}
