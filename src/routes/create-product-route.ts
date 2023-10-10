import {
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError,
  RequestValidationError,
  requireAuth,
  awsSqsClient,
} from "@craftyverse-au/craftyverse-common";
import express, { Request, Response } from "express";
import { Location } from "../models/Location";
import { Product } from "../models/Product";
import {
  productRequestSchema,
  NewProductRequest,
} from "../schemas/product-schema";
import redisClient from "../services/redis-service";
import { awsConfig } from "../config/aws-config";
import { SQSClientConfig } from "@aws-sdk/client-sqs";
const router = express.Router();

interface LocationCreatedEvent {
  Type: string;
  MessageId: string;
  TopicArn: string;
  Message: string;
  Timestamp: string;
  SignatureVersion: string;
  Signature: string;
  SigningCertURL: string;
  UnsubscribeURL: string;
  Subject: string;
}

router.post(
  "/api/product/createProduct",
  requireAuth,
  async (req: Request, res: Response) => {
    const createProductRequestData = productRequestSchema.safeParse(req.body);

    if (!createProductRequestData.success) {
      throw new RequestValidationError(createProductRequestData.error.issues);
    }

    const createProductRequest: NewProductRequest =
      createProductRequestData.data;

    // STEP 0:
    // Extract location info from sns topic

    const latestMsg = await awsSqsClient.receiveQueueMessage(
      awsConfig as SQSClientConfig,
      `${process.env.LOCALSTACK_HOST_URL}/location_created_queue`,
      {
        attributeNames: ["All"],
        maxNumberOfMessages: 10,
        waitTimeSeconds: 5,
      }
    );

    if (!latestMsg || !latestMsg.Messages) {
      throw new BadRequestError("Something is wrong!");
    }
    console.log("This is the latest messages in queue: ", latestMsg);

    const batchLocationEvent: LocationCreatedEvent[] = latestMsg.Messages.map(
      (msg) => {
        return JSON.parse(msg.Body!);
      }
    );

    const locations = batchLocationEvent.map((event) => {
      return JSON.parse(event.Message);
    });

    console.log("This is the batch location event: ", locations);

    // Might be benifitial to delete the processed location created events after processing

    // awsSqsClient.deleteQueueMessage(
    //   awsConfig as SQSClientConfig,
    //   "http://craftyverse-aws-localcstack:4566/000000000000/location_created_queue",
    //   latestMsg.Messages[0].ReceiptHandle!
    // );

    locations.forEach(async (location) => {
      const locationEvent = Location.build({
        locationId: location.locationId,
        locationName: location.locationName,
        locationApproved: location.locationApproved,
        locationEmail: location.locationEmail,
        locationLegalAddressLine1: location.locationLegalAddressLine1,
        locationLegalAddressLine2: location.locationLegalAddressLine2,
      });

      const createdProductLocation = await locationEvent.save();
      console.log(
        "This is the created product location: ",
        createdProductLocation
      );
    });

    // STEP 1:
    // Find the location that a new product needs to be associated to.

    const location = await Location.findOne({
      locationId: createProductRequest.productLocationId,
    });

    console.log("This is the location: ", location);

    if (!location) {
      throw new NotFoundError("The location does not exist");
    }

    // STEP 2:
    // Create the product with the associated location
    const createProduct = Product.build({
      productUserId: req.currentUser!.userId,
      productLocation: location,
      productCategoryId: createProductRequest.productCategoryId,
      productName: createProductRequest.productName,
      productDescription: createProductRequest.productDescription,
      productImages: createProductRequest.productImageIds,
      productitems: [],
    });

    const savedProduct = await createProduct.save();

    if (!savedProduct) {
      throw new DatabaseConnectionError();
    }

    // STEP 3:
    // Product has been created and publish an event
    const createdProductResponse = {
      productUserId: savedProduct.productUserId,
      productLocation: savedProduct.productLocation,
      productCategoryId: savedProduct.productCategoryId,
      productName: savedProduct.productName,
      productDescription: savedProduct.productName,
      productImages: savedProduct.productImages,
    };

    redisClient.set(savedProduct.id, createdProductResponse);

    res.status(201).send({ ...createdProductResponse });
  }
);

export { router as createProductRoute };
