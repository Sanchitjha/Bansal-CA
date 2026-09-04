import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { Authenticate } from "../../common/middlewares/auth.middleware";
import { AuthController } from "./auth.controller";

export class AuthRoute implements IRoute {
  public path = "/api/auth";
  public router = Router();

  constructor(
    private readonly controller: AuthController,
    private readonly authenticate: Authenticate
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/login", this.controller.login);
    this.router.get("/me", this.authenticate.handle, this.controller.me);
  }
}
