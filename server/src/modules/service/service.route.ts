import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { ServiceController } from "./service.controller";

export class ServiceRoute implements IRoute {
  public path = "/api/services";
  public router = Router();

  constructor(private readonly controller: ServiceController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.controller.getServices);
    this.router.get("/:id", this.controller.getServiceById);
    this.router.post("/", this.controller.createService);
    this.router.put("/:id", this.controller.updateService);
    this.router.delete("/:id", this.controller.deleteService);

    // Sub-resources: Pricing and Revenue Rules
    this.router.get("/:id/pricing", this.controller.getPricing);
    this.router.post("/:id/pricing", this.controller.addPricing);
    this.router.get("/:id/revenue-rules", this.controller.getRevenueRules);
    this.router.post("/:id/revenue-rules", this.controller.addRevenueRule);
  }
}
