import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  NotFoundError,
  currentUser,
  errorHandler,
} from "@craftyverse-au/craftyverse-common";
import { createProductRoute } from "./routes/create-product-route";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
app.use(createProductRoute);

app.all("*", async () => {
  throw new NotFoundError("The route that you have requested does not exist");
});

app.use(errorHandler);

export { app };
