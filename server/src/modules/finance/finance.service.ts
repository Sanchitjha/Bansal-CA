import mongoose from "mongoose";
import { BadRequestException, NotFoundException } from "../../common/errors/http-exception";
import { FinanceRepository } from "./finance.repository";
import {
  IInvoice,
  IInvoiceWithId,
  IPayment,
  IPaymentWithId,
  IRevenueLedgerEntryWithId,
  IPartnerStatement,
  IPartnerStatementWithId,
  IPartnerPayout,
  IPartnerPayoutWithId,
} from "./finance.types";
import { CommissionEngine } from "./commission.engine";
import { CommissionPlanModel, ICommissionPlan } from "./commission-plan.model";

export class FinanceService {
  private readonly commissionEngine = new CommissionEngine();

  constructor(private readonly financeRepository: FinanceRepository) {}

  // Commission Plan CRUD
  public async createCommissionPlan(data: Partial<ICommissionPlan>): Promise<ICommissionPlan> {
    if (!data.name) {
      throw new BadRequestException("Commission plan name is required");
    }
    return CommissionPlanModel.create(data);
  }

  public async getCommissionPlans(serviceId?: string, partnerId?: string): Promise<ICommissionPlan[]> {
    const query: any = {};
    if (serviceId) query.serviceId = serviceId;
    if (partnerId) query.partnerId = partnerId;
    return CommissionPlanModel.find(query).lean() as unknown as ICommissionPlan[];
  }

  // Invoices
  public async createInvoice(data: IInvoice): Promise<IInvoiceWithId> {
    if (!data.invoiceNumber || !data.caseId || !data.clientId || data.totalAmountMinor <= 0) {
      throw new BadRequestException("invoiceNumber, caseId, clientId, and positive total amount are required");
    }
    return this.financeRepository.createInvoice(data);
  }

  public async getInvoiceById(id: string): Promise<IInvoiceWithId> {
    const invoice = await this.financeRepository.findInvoiceById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }
    return invoice;
  }

  // Payments
  public async createPayment(data: IPayment): Promise<IPaymentWithId> {
    if (!data.paymentNumber || !data.caseId || !data.clientId || !data.idempotencyKey) {
      throw new BadRequestException("paymentNumber, caseId, clientId, and idempotencyKey are required");
    }
    // Check for double delivery
    const existing = await this.financeRepository.findPaymentByIdempotencyKey(data.idempotencyKey);
    if (existing) {
      return existing;
    }
    return this.financeRepository.createPayment(data);
  }

  public async getPaymentById(id: string): Promise<IPaymentWithId> {
    const payment = await this.financeRepository.findPaymentById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return payment;
  }

  // Settle Webhook with Commission Engine integration
  public async verifyPaymentWebhook(paymentId: string, gatewayPaymentId: string): Promise<IPaymentWithId> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const payment = await this.financeRepository.findPaymentById(paymentId);
      if (!payment) {
        throw new NotFoundException(`Payment with id ${paymentId} not found`);
      }
      if (payment.status === "SUCCESS") {
        await session.commitTransaction();
        session.endSession();
        return payment;
      }

      // Update payment
      const updatedPayment = await this.financeRepository.updatePayment(paymentId, {
        status: "SUCCESS",
        gatewayPaymentId,
        verifiedAt: new Date(),
      });

      if (!updatedPayment) {
        throw new Error("Failed to update payment");
      }

      // Settle invoice if linked
      if (payment.invoiceId) {
        await this.financeRepository.updateInvoice(payment.invoiceId, {
          status: "PAID",
          paidAt: new Date(),
        });
      }

      // Run Commission Engine if partner exists
      if (payment.partnerId) {
        await this.commissionEngine.calculateAndRecordCommission({
          partnerId: payment.partnerId,
          caseId: payment.caseId,
          paymentId: payment.id,
          grossAmountMinor: payment.amountMinor,
        });
      }

      await session.commitTransaction();
      session.endSession();
      return updatedPayment;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  // Statements & Payouts
  public async getLedgerEntries(partnerId: string): Promise<IRevenueLedgerEntryWithId[]> {
    return this.financeRepository.findLedgerEntriesByPartner(partnerId);
  }

  public async generateStatement(data: IPartnerStatement): Promise<IPartnerStatementWithId> {
    return this.financeRepository.createStatement(data);
  }

  public async triggerPayout(data: IPartnerPayout): Promise<IPartnerPayoutWithId> {
    return this.financeRepository.createPayout(data);
  }

  public async settlePayout(payoutId: string, utr: string): Promise<IPartnerPayoutWithId> {
    const updated = await this.financeRepository.updatePayout(payoutId, {
      status: "PAID",
      paidAt: new Date(),
      utr,
    });
    if (!updated) {
      throw new NotFoundException(`Payout with id ${payoutId} not found`);
    }
    return updated;
  }
}
