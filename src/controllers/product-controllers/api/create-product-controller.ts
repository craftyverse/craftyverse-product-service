import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import "dotenv/config";
import { productSchema } from "../../../schemas/product-schema";
import {
  NotFoundError,
  RequestValidationError,
} from "@craftyverse-au/craftyverse-common";
import { logEvents } from "../../../middleware/log-events";
import { LocationService } from "../../../services/location/location";
import { sqsUtils } from "../../../utils/awsUtils/sqsUtils";
import { ProductService } from "../../../services/product/product";
import { RedisService } from "../../../services/redis";
import { SnsService } from "../../../services/sns";
import { awsConfig } from "../../../../config/aws-config";
import { SqsService } from "../../../services/sqs";

type Product = {
  id: number;
  locationId: string;
  name: string;
  description: string;
  createdAt: string;
  deletedAt: string | null;
};

// API Route Signature: /api/product/v1/createProduct
const createProductHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // retrieving authenticated user email
    const currentDate = new Date();

    // Checking that the request is valid
    const createProductRequest = productSchema.safeParse(req.body);

    if (!createProductRequest.success) {
      logEvents(
        `${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(
          createProductRequest.error.issues
        )}`,
        "errors.txt"
      );
      throw new RequestValidationError(createProductRequest.error.issues);
    }

    const product = createProductRequest.data;
    console.log(product);

    // Retrieve the location created message from the queue
    const locationResposne = await sqsUtils.filterMessageByLlocationId(
      product.locationId,
      "location-created-queue"
    );

    console.log("This is the retrieved location: ", location);

    if (
      !locationResposne ||
      !locationResposne.location ||
      !locationResposne.receiptHandle
    ) {
      throw new NotFoundError(
        "Could not find location with the given locationId"
      );
    }

    // query the location table to see if the returned location is already in the database
    // Only proceed to create the location if it does not exist
    const existingLocation = await LocationService.getLocationByLocationId(
      locationResposne.location._id
    );

    if (!existingLocation) {
      await LocationService.createLocation(
        req.userEmail,
        locationResposne.location
      );

      await SqsService.deleteQueueMessageById(
        awsConfig,
        "location-created-queue:url",
        locationResposne.receiptHandle
      );
    }

    // store product into database
    const createdproductDbResponse = await ProductService.createProduct({
      locationId: product.locationId,
      name: product.name,
      description: product.description,
      createdAt: currentDate.toISOString(),
      deletedAt: null,
      updatedAt: null,
    });

    const createdProduct: Product = createdproductDbResponse[0][0];
    const createdProductString = JSON.stringify(createdProduct);

    console.log(
      "This is the created product: ",
      createdproductDbResponse[0][0]
    );

    // Todo: Cache the created product
    const existingCachedProduct = await RedisService.get(
      `product:${createdProduct.id}`
    );

    if (!existingCachedProduct) {
      const cachedProduct = await RedisService.set(
        `product:${createdProduct.id}`,
        createdProductString
      );

      console.log(cachedProduct);
    }

    // Todo: Send a message to the product-created-queue
    await SnsService.publishSnsMessage(awsConfig, {
      message: createdProductString,
      subject: process.env.PRODUCT_CREATED_TOPIC!,
      topicArn: process.env.PRODUCT_CREATED_TOPIC_ARN!,
    });

    res.status(201).send("Successfully created the product");
  }
);

export { createProductHandler };
