import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { UserController } from "./user.controller";

export class UserRoute implements IRoute {
  public path = "/api/users";
  public router = Router();

  constructor(private readonly controller: UserController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.controller.getUsers);
    this.router.get("/external/:externalId", this.controller.getUserByExternalId);
    this.router.get("/:id", this.controller.getUserById);
    this.router.post("/", this.controller.createUser);
    this.router.put("/:id", this.controller.updateUser);
    this.router.delete("/:id", this.controller.deleteUser);
  }
}
