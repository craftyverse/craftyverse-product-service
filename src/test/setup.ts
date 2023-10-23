import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { SNSClient } from "@aws-sdk/client-sns";
import { SQSClient } from "@aws-sdk/client-sqs";
import { awsSnsClient, awsSqsClient } from "@craftyverse-au/craftyverse-common";

declare global {
  var signup: () => string[];
}

let mongoDb: any;
let mongoDbUri: any;
let testSnsClient: SNSClient;
let testSqsClient: SQSClient;
let testSnsTopic: string;

beforeAll(async () => {
  process.env.JWT_KEY = "asfoijea";
  mongoDb = await MongoMemoryServer.create();
  mongoDbUri = mongoDb.getUri();

  await mongoose.connect(mongoDbUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();

  const mockAwsConfig = {
    credentials: {
      accessKeyId: "aws_access_key_id",
      secretAccessKey: "aws_secret_access_key",
    },
    region: "us-east-1",
    endpoint: "http://localhost:4666",
  };

  const sqsQueueAttributes = {
    delaySeconds: "0",
    messageRetentionPeriod: "604800", // 7 days
    receiveMessageWaitTimeSeconds: "0",
  };

  const collections = await mongoose.connection.db.collections();
  collections.map(async (collection) => {
    await collection.deleteMany({});
  });

  testSnsClient = awsSnsClient.createSnsClient(mockAwsConfig);
  testSqsClient = awsSqsClient.createSqsClient(mockAwsConfig);
});

// Close conenction after test suite
afterAll(async () => {
  await mongoDb.stop();
  await mongoose.connection.close();
});

global.signup = () => {
  const payload = {
    userId: new mongoose.Types.ObjectId().toHexString(),
    userFirstName: "Tony",
    userLastName: "Li",
    userEmail: "tony.li@test.io",
    iat: 1693135454,
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
