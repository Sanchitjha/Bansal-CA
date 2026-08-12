import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { RoleController } from "./role.controller";

export class RoleRoute implements IRoute {
  public path = "/api/roles";
  public router = Router();

  constructor(private readonly controller: RoleController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.controller.getRoles);
    this.router.get("/:id", this.controller.getRoleById);
    this.router.post("/", this.controller.createRole);
    this.router.put("/:id", this.controller.updateRole);
    this.router.delete("/:id", this.controller.deleteRole);
  }
}
