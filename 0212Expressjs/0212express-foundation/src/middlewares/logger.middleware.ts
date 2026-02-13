import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const correlationId = (req.headers["x-correlation-id"] as string) || uuidv4();
  (req as any).correlationId = correlationId;

  res.setHeader("X-Correlation-ID", correlationId);

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    console.log(
      `[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms - Correlation ID: ${correlationId}`,
    );
  });
  next();
};
