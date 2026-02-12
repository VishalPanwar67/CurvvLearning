import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { notFound } from "./middlewares/notFound.ts";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, message: "Welcome to the API" });
});

app.use(notFound);
app.use(errorHandler);
export default app;
