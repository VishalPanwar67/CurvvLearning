import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import { requestLogger } from "./middlewares/logger.middleware";
import { authMiddleware } from "./middlewares/auth.middleware";
import { validateRequest } from "./middlewares/validate.middleware";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app: Application = express();

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, message: "Welcome to the API" });
});

app.post(
  "/api/data",
  authMiddleware,
  validateRequest({ body: ["name"] }),
  (req, res) => {
    res.json({ success: true, data: "Safe and Logged!" });
  },
);

app.use(notFound);
// app.use(errorHandler);
app.use(globalErrorHandler);
export default app;
