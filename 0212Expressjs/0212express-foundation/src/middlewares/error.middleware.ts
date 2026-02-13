import type { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const correlationId = (req as any).correlationId;

  res.status(err.statusCode || 500).json({
    success: false,
    correlationId: correlationId,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: err.message || "Something went wrong",
    },
  });
};
