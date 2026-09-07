import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { PartnerController } from "./partner.controller";
import { Authenticate } from "../../common/middlewares/auth.middleware";

export class PartnerRoute implements IRoute {
  public path = "/api/partners";
  public router = Router();

  constructor(
    private readonly controller: PartnerController,
    private readonly authMiddleware?: Authenticate
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const auth = this.authMiddleware ? [this.authMiddleware.handle] : [];

    // Routing Rules
    this.router.get("/routing-rules", ...auth, this.controller.getRoutingRules);
    this.router.post("/routing-rules", ...auth, this.controller.createRoutingRule);

    // Partners
    this.router.get("/", ...auth, this.controller.getPartners);
    this.router.get("/user/:userId", ...auth, this.controller.getPartnerByUserId);
    this.router.get("/:id", ...auth, this.controller.getPartnerById);
    this.router.post("/", ...auth, this.controller.createPartner);
    this.router.put("/:id", ...auth, this.controller.updatePartner);
    this.router.delete("/:id", ...auth, this.controller.deletePartner);
  }
}
