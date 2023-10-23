import { awsSnsClient } from "@craftyverse-au/craftyverse-common";
import { awsConfig } from "../config/aws-config";
import { productEventVariables } from "@craftyverse-au/craftyverse-common";

export const createProductCreatedTopic = async (): Promise<string> => {
  const productCreatedTopic = productEventVariables.PRODUCT_CREATED_EVENT;
  const topicArn = await awsSnsClient.createSnsTopic(
    awsConfig,
    productCreatedTopic
  );
  return topicArn.topicArn;
};
