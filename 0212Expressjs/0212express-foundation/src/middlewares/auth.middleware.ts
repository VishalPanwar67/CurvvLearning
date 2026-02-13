import type { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next({
      statusCode: 401,
      code: "UNAUTHORIZED",
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  (req as any).user = {
    id: "usr_8821",
    role: "admin",
    email: "admin@system.internal",
  };

  return next();
};
