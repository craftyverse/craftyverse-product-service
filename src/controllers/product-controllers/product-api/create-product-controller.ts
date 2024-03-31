import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import "dotenv/config";
import { productSchema } from "../../../schemas/product-schema";
import {
  NotFoundError,
  RequestValidationError,
} from "@craftyverse-au/craftyverse-common";
import { logEvents } from "../../../middleware/log-events";
import { LocationService } from "../../../services/location";
import { sqsUtils } from "../../../utils/awsUtils/sqsUtils";
import { Location } from "../../../schemas/location-schema";
import { ProductService } from "../../../services/product";

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
    const location: Location | undefined =
      await sqsUtils.filterMessageByLlocationId(
        product.locationId,
        "location-created-queue:url"
      );

    console.log("This is the retrieved location: ", location);

    // Store location in the database
    if (!location) {
      throw new NotFoundError(
        "Could not find location with the given locationId"
      );
    }

    await LocationService.createLocation(req.userEmail, location);

    // store product into database
    await ProductService.createProduct({
      locationId: product.locationId,
      name: product.name,
      description: product.description,
      createdAt: currentDate.toISOString(),
      deletedAt: null,
    });

    res.status(201).send("OK");
  }
);

export { createProductHandler };
