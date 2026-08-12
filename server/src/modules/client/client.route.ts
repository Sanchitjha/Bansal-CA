import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { ClientController } from "./client.controller";

export class ClientRoute implements IRoute {
  public path = "/api/clients";
  public router = Router();

  constructor(private readonly controller: ClientController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.controller.getClients);
    this.router.get("/:id", this.controller.getClientById);
    this.router.post("/", this.controller.createClient);
    this.router.put("/:id", this.controller.updateClient);
    this.router.delete("/:id", this.controller.deleteClient);
  }
}
