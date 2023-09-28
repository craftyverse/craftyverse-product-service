import {
  DatabaseConnectionError,
  NotFoundError,
  RequestValidationError,
  requireAuth,
} from "@craftyverse-au/craftyverse-common";
import express, { Request, Response } from "express";
import { Location } from "../models/Location";
import { Product } from "../models/Product";
import {
  productRequestSchema,
  NewProductRequest,
} from "../schemas/product-schema";
import redisClient from "../services/redis-service";

const router = express.Router();

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

    // STEP 1:
    // Find the location that a new product needs to be associated to.

    const location = await Location.findById(
      createProductRequest.productLocationId
    );

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
      productImageIds: createProductRequest.productImageIds,
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
      productImageIds: savedProduct.productImageIds,
    };

    redisClient.set(savedProduct.id, createdProductResponse);

    res.status(201).send({ ...createdProductResponse });
  }
);

export { router as createProductRoute };
