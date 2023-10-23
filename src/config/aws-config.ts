import { SNSClientConfig } from "@aws-sdk/client-sns";

const awsConfig: SNSClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
  region: process.env.AWS_REGION!,
  endpoint: process.env.LOCALSTACK_HOST_URL!,
};

console.log(
  "This is the awsConfig localstack: ",
  process.env.LOCALSTACK_HOST_URL
);

if (!process.env.LOCALSTACK_HOST_URL || !process.env.LOCALSTACK_CLIENT_ID) {
  delete awsConfig.endpoint;
}

export { awsConfig };
