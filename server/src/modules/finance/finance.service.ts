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

export class FinanceService {
  constructor(private readonly financeRepository: FinanceRepository) {}

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

  // Settle Webhook (Atomic operation simulating transaction logic)
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

      // Create Ledger Entry if partner exists
      if (payment.partnerId) {
        const gross = payment.amountMinor;
        const tds = Math.floor(gross * 0.1); // 10% TDS default
        const partnerShare = Math.floor(gross * 0.2); // 20% Partner share default
        const net = partnerShare - tds;

        await this.financeRepository.createLedgerEntry({
          partnerId: new mongoose.Types.ObjectId(payment.partnerId),
          caseId: new mongoose.Types.ObjectId(payment.caseId),
          paymentId: new mongoose.Types.ObjectId(payment.id),
          entryType: "EARNING",
          grossAmountMinor: gross,
          eligibleRevenueMinor: gross,
          partnerShareMinor: partnerShare,
          tdsAmountMinor: tds,
          otherDeductionMinor: 0,
          netPayableMinor: net,
          ruleSnapshot: {
            ruleType: "PERCENTAGE",
            value: 20,
            tdsPercentage: 10,
          },
          status: "PENDING",
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
