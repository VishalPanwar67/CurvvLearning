import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", err);
  let code = "INTERNAL_SERVER_ERROR";
  let message = "An unexpected error occurred";

  if (err.name === "ValidationError") {
    code = "VALIDATION_ERROR";
    message = err.message;
  } else if (err.name === "UnauthorizedError") {
    code = "UNAUTHORIZED";
    message = "Invalid credentials";
    res.status(401);
  } else if (err.name === "ForbiddenError") {
    code = "FORBIDDEN";
    message = "Access denied";
    res.status(403);
  }

  if (!res.statusCode || res.statusCode === 200) {
    res.status(500);
  }

  res.json({
    success: false,
    error: {
      code,
      message,
    },
  });
};

export { errorHandler };
