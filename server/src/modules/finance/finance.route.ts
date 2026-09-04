import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { FinanceController } from "./finance.controller";

/**
 * @openapi
 * tags:
 *   name: Finance
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       additionalProperties: true
 *     InvoiceInput:
 *       type: object
 *       additionalProperties: true
 *     Payment:
 *       type: object
 *       additionalProperties: true
 *     PaymentInput:
 *       type: object
 *       additionalProperties: true
 *     LedgerEntry:
 *       type: object
 *       additionalProperties: true
 *     Statement:
 *       type: object
 *       additionalProperties: true
 *     StatementInput:
 *       type: object
 *       additionalProperties: true
 *     Payout:
 *       type: object
 *       additionalProperties: true
 *     PayoutInput:
 *       type: object
 *       additionalProperties: true
 * /api/finance/invoices:
 *   post:
 *     summary: Create an invoice
 *     tags: [Finance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/InvoiceInput' }
 *     responses:
 *       201:
 *         description: Created invoice
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Invoice' }
 * /api/finance/invoices/{id}:
 *   get:
 *     summary: Get an invoice by ID
 *     tags: [Finance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Invoice found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Invoice' }
 *       404:
 *         description: Invoice not found
 * /api/finance/payments:
 *   post:
 *     summary: Create a payment
 *     tags: [Finance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PaymentInput' }
 *     responses:
 *       201:
 *         description: Created payment
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Payment' }
 * /api/finance/payments/{id}/verify:
 *   post:
 *     summary: Verify a payment (gateway webhook)
 *     tags: [Finance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Verified payment
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Payment' }
 * /api/finance/ledger/{partnerId}:
 *   get:
 *     summary: Get ledger entries for a partner
 *     tags: [Finance]
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of ledger entries
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/LedgerEntry' } }
 * /api/finance/statements:
 *   post:
 *     summary: Generate a statement
 *     tags: [Finance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/StatementInput' }
 *     responses:
 *       201:
 *         description: Generated statement
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Statement' }
 * /api/finance/payouts:
 *   post:
 *     summary: Trigger a payout
 *     tags: [Finance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PayoutInput' }
 *     responses:
 *       201:
 *         description: Created payout
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Payout' }
 * /api/finance/payouts/{id}/settle:
 *   post:
 *     summary: Settle a payout
 *     tags: [Finance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Settled payout
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Payout' }
 */
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
