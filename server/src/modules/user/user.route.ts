import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { Authenticate } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/authorize.middleware";
import { UserController } from "./user.controller";

export class UserRoute implements IRoute {
  public path = "/api/users";
  public router = Router();

  constructor(
    private readonly controller: UserController,
    private readonly authenticate: Authenticate
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(this.authenticate.handle);

    this.router.get("/", authorize("user.read"), this.controller.getUsers);
    this.router.get(
      "/external/:externalId",
      authorize("user.read"),
      this.controller.getUserByExternalId
    );
    this.router.get("/:id", authorize("user.read"), this.controller.getUserById);
    this.router.post("/", authorize("user.write"), this.controller.createUser);
    this.router.put("/:id", authorize("user.write"), this.controller.updateUser);
    this.router.delete("/:id", authorize("user.write"), this.controller.deleteUser);
  }
}
