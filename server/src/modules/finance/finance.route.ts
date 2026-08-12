import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { FinanceController } from "./finance.controller";

export class FinanceRoute implements IRoute {
  public path = "/api/finance";
  public router = Router();

  constructor(private readonly controller: FinanceController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Invoices
    this.router.post("/invoices", this.controller.createInvoice);
    this.router.get("/invoices/:id", this.controller.getInvoiceById);

    // Payments & Gateway Webhook Verifications
    this.router.post("/payments", this.controller.createPayment);
    this.router.post("/payments/:id/verify", this.controller.verifyPayment);

    // Ledger Entries
    this.router.get("/ledger/:partnerId", this.controller.getLedger);

    // Statements
    this.router.post("/statements", this.controller.generateStatement);

    // Payouts
    this.router.post("/payouts", this.controller.triggerPayout);
    this.router.post("/payouts/:id/settle", this.controller.settlePayout);
  }
}
