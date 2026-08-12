import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { PartnerController } from "./partner.controller";

export class PartnerRoute implements IRoute {
  public path = "/api/partners";
  public router = Router();

  constructor(private readonly controller: PartnerController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.controller.getPartners);
    this.router.get("/:id", this.controller.getPartnerById);
    this.router.post("/", this.controller.createPartner);
    this.router.put("/:id", this.controller.updatePartner);
    this.router.delete("/:id", this.controller.deletePartner);
  }
}
