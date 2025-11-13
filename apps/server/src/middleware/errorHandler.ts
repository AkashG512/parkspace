import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (res.headersSent) {
    return;
  }

  const statusCode = err instanceof Error && (err as any).statusCode ? (err as any).statusCode : 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";

  res.status(statusCode).json({ message });
}
