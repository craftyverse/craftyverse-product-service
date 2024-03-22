import express, { Request, Response } from "express";
import { verifyJWT } from "@craftyverse-au/craftyverse-common";

const router = express.Router();

router.get("/healthcheck", (req: Request, res: Response) => {
  // There will be more to this route.
  res.status(200).json({
    health: "OK",
  });
});

export { router as v1ProductRouter };
