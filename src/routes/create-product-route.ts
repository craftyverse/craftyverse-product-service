import {
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError,
  RequestValidationError,
  requireAuth,
  awsSqsClient,
  imageQueueVariables,
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
import { ProductImage } from "../models/ProductImage";
const router = express.Router();

interface snsMessageEvent {
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

    const latestLocationMsg = await awsSqsClient.receiveQueueMessage(
      awsConfig as SQSClientConfig,
      `${process.env.LOCALSTACK_HOST_URL}/location_created_queue`,
      {
        attributeNames: ["All"],
        maxNumberOfMessages: 10,
        waitTimeSeconds: 5,
      }
    );

    const latestImageMsg = await awsSqsClient.receiveQueueMessage(
      awsConfig as SQSClientConfig,
      `${process.env.LOCALSTACK_HOST_URL}/${imageQueueVariables.IMAGE_UPLOADED_QUEUE}`,
      {
        attributeNames: ["All"],
        maxNumberOfMessages: 10,
        waitTimeSeconds: 5,
      }
    );

    if (
      !latestLocationMsg ||
      !latestLocationMsg.Messages ||
      !latestImageMsg ||
      !latestImageMsg.Messages
    ) {
      throw new BadRequestError("Something is wrong (No event messages)!");
    }
    console.log("This is the latest messages in queue: ", latestLocationMsg);
    console.log("This is the latest image messages in queue: ", latestImageMsg);

    const batchLocationEvent: snsMessageEvent[] =
      latestLocationMsg.Messages.map((msg) => {
        return JSON.parse(msg.Body!);
      });

    const batchImageEvent: snsMessageEvent[] = latestImageMsg.Messages.map(
      (msg) => {
        return JSON.parse(msg.Body!);
      }
    );

    const locations = batchLocationEvent.map((event) => {
      return JSON.parse(event.Message);
    });

    const images = batchImageEvent.map((event) => {
      return JSON.parse(event.Message);
    });

    console.log("This is the batch location event: ", locations);

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

    images.forEach(async (image) => {
      const imageEvent = ProductImage.build({
        productImageFileName: image.imageFileName,
        productImageFileOriginalName: image.imageFileOriginalName,
        productImageDescription: image.imageDescription,
        productImageProductName: createProductRequest.productName,
      });

      const createdProductImage = await imageEvent.save();
      console.log("This is the created product image: ", createdProductImage);
    });

    // STEP 1:
    // Find the location that a new product needs to be associated to.

    const location = await Location.findOne({
      locationId: createProductRequest.productLocationId,
    });

    const productImages = await ProductImage.find({
      productImageProductName: createProductRequest.productName,
    });

    console.log("This is the location : ", location);
    console.log("This is the product images : ", productImages);

    if (!location) {
      throw new NotFoundError("The location does not exist");
    }

    if (!productImages) {
      throw new NotFoundError("The product image does not exist");
    }

    // STEP 2:
    // Create the product with the associated location

    const createProduct = Product.build({
      productUserId: req.currentUser!.userId,
      productLocation: location,
      productCategoryId: createProductRequest.productCategoryId,
      productName: createProductRequest.productName,
      productDescription: createProductRequest.productDescription,
      productImages: productImages,
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
      productDescription: savedProduct.productDescription,
      productImages: savedProduct.productImages,
    };

    const productString = JSON.stringify(createdProductResponse);
    console.log("This is the product string: ", productString);

    // Push resposne to SQS queue

    redisClient.set(savedProduct.id, createdProductResponse);

    res.status(201).send({ ...createdProductResponse });
  }
);

export { router as createProductRoute };
