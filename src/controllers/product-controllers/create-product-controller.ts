import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import "dotenv/config";

const createProductHandler = asyncHandler(
  async (req: Request, res: Response) => {}
);
