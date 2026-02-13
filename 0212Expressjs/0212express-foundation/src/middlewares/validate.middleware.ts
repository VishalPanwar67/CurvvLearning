import type { Request, Response, NextFunction } from "express";

interface ValidationError {
  body?: string[];
  query?: string[];
  params?: string[];
}

export const validateRequest = (schema: ValidationError) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];
    ["body", "query", "params"].forEach((key) => {
      const schemaFields = schema[key as keyof ValidationError];
      const requestData = req[key as keyof Request];
    });

    if (errors.length > 0) {
      return next({
        statusCode: 400,
        code: "VALIDATION_ERROR",
        message: errors.join(", "),
      });
    }

    next();
  };
};
