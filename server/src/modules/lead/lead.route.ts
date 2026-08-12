import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { LeadController } from "./lead.controller";

export class LeadRoute implements IRoute {
  public path = "/api/leads";
  public router = Router();

  constructor(private readonly controller: LeadController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.controller.getLeads);
    this.router.get("/:id", this.controller.getLeadById);
    this.router.post("/", this.controller.createLead);
    this.router.put("/:id", this.controller.updateLead);
    this.router.delete("/:id", this.controller.deleteLead);
  }
}
