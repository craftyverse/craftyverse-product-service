import express, { Request, Response } from "express";
import { verifyJWT } from "@craftyverse-au/craftyverse-common";
import { createProductHandler } from "../../controllers/product-controllers/product-api/create-product-controller";

const router = express.Router();

router.get("/healthcheck", (req: Request, res: Response) => {
  // There will be more to this route.
  res.status(200).json({
    health: "OK",
  });
});

router.post("/createProduct", verifyJWT, createProductHandler);

export { router as v1ProductRouter };
