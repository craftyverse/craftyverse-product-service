import { STSClient } from "@aws-sdk/client-sts";

const awsStsClient = () => {
  let StsClient;
  const createStsClient = (config: STSClient) => {
    if (!config) {
      StsClient = new STSClient(config);
    }

    return;
  };
  const getClientId = () => {};
};
