import { NextFunction, Request, Response } from "express";
import { HttpException } from "../errors/http-exception";

export class ErrorMiddleware {
  public handle = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    const status = err instanceof HttpException ? err.status : 500;
    const message = err instanceof HttpException ? err.message : "Internal server error";

    if (status === 500) {
      console.error(err);
    }

    res.status(status).json({ status, message });
  };
}
