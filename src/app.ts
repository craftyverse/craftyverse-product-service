import express from "express";
import cors from "cors";
import { corsOptions } from "../config/cors-options";
import { logger } from "./middleware/log-events";
import { credentials } from "./middleware/credentials";
import { v1ProductRouter } from "./routes/v1/product-routes/product-routes";
import {
  NotFoundError,
  errorHandler,
} from "@craftyverse-au/craftyverse-common";

const app = express();

app.use(logger);

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/product/v1", v1ProductRouter);

app.all("*", () => {
  const message = "The route that you have requested does not exist";
  throw new NotFoundError(message);
});

app.use(errorHandler);

export { app };
