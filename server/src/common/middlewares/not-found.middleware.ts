import { Request, Response } from "express";

export class NotFoundMiddleware {
  public handle = (req: Request, res: Response): void => {
    res.status(404).json({
      status: 404,
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  };
}
