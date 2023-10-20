import { SNSClientConfig } from "@aws-sdk/client-sns";

const awsConfig: SNSClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
  region: process.env.AWS_REGION!,

  endpoint: process.env.AWS_LOCALSTACK_URI!,
};

if (!process.env.AWS_LOCALSTACK_URI) {
  delete awsConfig.endpoint;
}

export { awsConfig };
