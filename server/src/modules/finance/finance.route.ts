import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { FinanceController } from "./finance.controller";
import { Authenticate } from "../../common/middlewares/auth.middleware";

export class FinanceRoute implements IRoute {
  public path = "/api/finance";
  public router = Router();

  constructor(
    private readonly controller: FinanceController,
    private readonly authMiddleware?: Authenticate
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const auth = this.authMiddleware ? [this.authMiddleware.handle] : [];

    // Commission Plans
    this.router.get("/commission-plans", ...auth, this.controller.getCommissionPlans);
    this.router.post("/commission-plans", ...auth, this.controller.createCommissionPlan);

    // Invoices
    this.router.post("/invoices", ...auth, this.controller.createInvoice);
    this.router.get("/invoices/:id", ...auth, this.controller.getInvoiceById);

    // Payments & Gateway Webhook Verifications
    this.router.post("/payments", ...auth, this.controller.createPayment);
    this.router.post("/payments/:id/verify", ...auth, this.controller.verifyPayment);

    // Ledger Entries
    this.router.get("/ledger/:partnerId", ...auth, this.controller.getLedger);

    // Statements
    this.router.post("/statements", ...auth, this.controller.generateStatement);

    // Payouts
    this.router.post("/payouts", ...auth, this.controller.triggerPayout);
    this.router.post("/payouts/:id/settle", ...auth, this.controller.settlePayout);
  }
}
