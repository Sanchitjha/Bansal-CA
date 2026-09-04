import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../errors/http-exception";
import { IAuthService } from "../../modules/auth/auth.types";

export class Authenticate {
  constructor(private readonly authService: IAuthService) {}

  public handle = (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith("Bearer ")) {
        throw new UnauthorizedException("Missing bearer token");
      }
      const token = header.slice(7).trim();
      if (!token) {
        throw new UnauthorizedException("Missing bearer token");
      }
      req.user = this.authService.verifyToken(token);
      next();
    } catch (err) {
      next(err);
    }
  };
}
