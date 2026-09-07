import { NextFunction, Request, Response } from "express";
import { logger } from "../../config/logger";
import { HttpException } from "../errors/http-exception";

export class ErrorMiddleware {
  public handle = (
    err: Error | any,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    const status = err instanceof HttpException ? err.status : err.status || 500;
    const message = err instanceof HttpException ? err.message : err.message || "Internal server error";
    const correlationId = (req.headers["x-correlation-id"] as string) || (req.headers["x-request-id"] as string) || `req-${Date.now()}`;

    if (status === 500) {
      logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, { stack: err.stack, correlationId });
    } else {
      logger.warn(`${req.method} ${req.originalUrl} - ${message}`, { correlationId });
    }

    res.status(status).json({
      code: status,
      message,
      fieldErrors: err.fieldErrors || null,
      correlationId,
      timestamp: new Date().toISOString(),
    });
  };
}
