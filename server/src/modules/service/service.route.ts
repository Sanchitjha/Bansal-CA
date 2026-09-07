import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { ServiceController } from "./service.controller";
import { Authenticate } from "../../common/middlewares/auth.middleware";

export class ServiceRoute implements IRoute {
  public path = "/api/services";
  public router = Router();

  constructor(
    private readonly controller: ServiceController,
    private readonly authMiddleware?: Authenticate
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const auth = this.authMiddleware ? [this.authMiddleware.handle] : [];

    // Form Schemas
    this.router.get("/form-schemas", ...auth, this.controller.getFormSchemas);
    this.router.post("/form-schemas", ...auth, this.controller.createFormSchema);

    // Core Services
    this.router.get("/", ...auth, this.controller.getServices);
    this.router.get("/:id", ...auth, this.controller.getServiceById);
    this.router.post("/", ...auth, this.controller.createService);
    this.router.put("/:id", ...auth, this.controller.updateService);
    this.router.delete("/:id", ...auth, this.controller.deleteService);

    // Service Versions
    this.router.get("/:id/versions", ...auth, this.controller.getServiceVersions);
    this.router.post("/:id/versions", ...auth, this.controller.createServiceVersion);

    // Sub-resources: Pricing and Revenue Rules
    this.router.get("/:id/pricing", ...auth, this.controller.getPricing);
    this.router.post("/:id/pricing", ...auth, this.controller.addPricing);
    this.router.get("/:id/revenue-rules", ...auth, this.controller.getRevenueRules);
    this.router.post("/:id/revenue-rules", ...auth, this.controller.addRevenueRule);
  }
}
