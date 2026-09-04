import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../../common/errors/http-exception";
import { IAuthService } from "./auth.types";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedException();
      }
      res.status(200).json(req.user);
    } catch (err) {
      next(err);
    }
  };
}
