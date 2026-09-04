import { NextFunction, Request, Response } from "express";
import { logger } from "../../config/logger";
import { HttpException } from "../errors/http-exception";

export class ErrorMiddleware {
  public handle = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    const status = err instanceof HttpException ? err.status : 500;
    const message = err instanceof HttpException ? err.message : "Internal server error";

    if (status === 500) {
      logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, { stack: err.stack });
    } else {
      logger.warn(`${req.method} ${req.originalUrl} - ${message}`);
    }

    res.status(status).json({ status, message });
  };
}
