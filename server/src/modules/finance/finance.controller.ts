import { NextFunction, Request, Response } from "express";
import { FinanceService } from "./finance.service";

export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // Commission Plans
  public createCommissionPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const plan = await this.financeService.createCommissionPlan(req.body);
      res.status(201).json(plan);
    } catch (err) {
      next(err);
    }
  };

  public getCommissionPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { serviceId, partnerId } = req.query as { serviceId?: string; partnerId?: string };
      const plans = await this.financeService.getCommissionPlans(serviceId, partnerId);
      res.status(200).json(plans);
    } catch (err) {
      next(err);
    }
  };

  // Invoices
  public createInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const invoice = await this.financeService.createInvoice(req.body);
      res.status(201).json(invoice);
    } catch (err) {
      next(err);
    }
  };

  public getInvoiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const invoice = await this.financeService.getInvoiceById(req.params.id);
      res.status(200).json(invoice);
    } catch (err) {
      next(err);
    }
  };

  // Payments
  public createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payment = await this.financeService.createPayment(req.body);
      res.status(201).json(payment);
    } catch (err) {
      next(err);
    }
  };

  // Webhook settlement endpoint
  public verifyPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { gatewayPaymentId } = req.body;
      const payment = await this.financeService.verifyPaymentWebhook(
        req.params.id,
        gatewayPaymentId
      );
      res.status(200).json(payment);
    } catch (err) {
      next(err);
    }
  };

  // Ledger Entries
  public getLedger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ledger = await this.financeService.getLedgerEntries(req.params.partnerId);
      res.status(200).json(ledger);
    } catch (err) {
      next(err);
    }
  };

  // Statements
  public generateStatement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statement = await this.financeService.generateStatement(req.body);
      res.status(201).json(statement);
    } catch (err) {
      next(err);
    }
  };

  // Payouts
  public triggerPayout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payout = await this.financeService.triggerPayout(req.body);
      res.status(201).json(payout);
    } catch (err) {
      next(err);
    }
  };

  public settlePayout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { utr } = req.body;
      const payout = await this.financeService.settlePayout(req.params.id, utr);
      res.status(200).json(payout);
    } catch (err) {
      next(err);
    }
  };
}
