/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "mongoose";
import { InvoiceModel } from "./invoice.model";
import { PaymentModel } from "./payment.model";
import { RevenueLedgerEntryModel } from "./revenue-ledger.model";
import { PartnerStatementModel } from "./statement.model";
import { PartnerPayoutModel } from "./payout.model";
import {
  IInvoice,
  IInvoiceWithId,
  IPayment,
  IPaymentWithId,
  IRevenueLedgerEntry,
  IRevenueLedgerEntryWithId,
  IPartnerStatement,
  IPartnerStatementWithId,
  IPartnerPayout,
  IPartnerPayoutWithId,
} from "./finance.types";

function toInvoiceWithId(doc: any): IInvoiceWithId {
  return {
    id: String(doc._id),
    invoiceNumber: doc.invoiceNumber,
    caseId: String(doc.caseId),
    clientId: String(doc.clientId),
    amountMinor: doc.amountMinor,
    taxAmountMinor: doc.taxAmountMinor,
    totalAmountMinor: doc.totalAmountMinor,
    currency: doc.currency,
    status: doc.status,
    dueAt: doc.dueAt,
    issuedAt: doc.issuedAt,
    paidAt: doc.paidAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toPaymentWithId(doc: any): IPaymentWithId {
  return {
    id: String(doc._id),
    paymentNumber: doc.paymentNumber,
    caseId: String(doc.caseId),
    invoiceId: doc.invoiceId ? String(doc.invoiceId) : null,
    clientId: String(doc.clientId),
    partnerId: doc.partnerId ? String(doc.partnerId) : null,
    amountMinor: doc.amountMinor,
    currency: doc.currency,
    method: doc.method,
    gateway: doc.gateway,
    gatewayOrderId: doc.gatewayOrderId,
    gatewayPaymentId: doc.gatewayPaymentId,
    status: doc.status,
    idempotencyKey: doc.idempotencyKey,
    verifiedAt: doc.verifiedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class FinanceRepository {
  constructor(
    private readonly invoiceModel: Model<IInvoice> = InvoiceModel,
    private readonly paymentModel: Model<IPayment> = PaymentModel,
    private readonly ledgerModel: Model<IRevenueLedgerEntry> = RevenueLedgerEntryModel,
    private readonly statementModel: Model<IPartnerStatement> = PartnerStatementModel,
    private readonly payoutModel: Model<IPartnerPayout> = PartnerPayoutModel
  ) {}

  // Invoices
  public async createInvoice(data: IInvoice): Promise<IInvoiceWithId> {
    const doc = await this.invoiceModel.create(data);
    return toInvoiceWithId(doc);
  }

  public async findInvoiceById(id: string): Promise<IInvoiceWithId | null> {
    const doc = await this.invoiceModel.findById(id).lean();
    return doc ? toInvoiceWithId(doc) : null;
  }

  public async updateInvoice(id: string, data: Partial<IInvoice>): Promise<IInvoiceWithId | null> {
    const doc = await this.invoiceModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? toInvoiceWithId(doc) : null;
  }

  // Payments
  public async createPayment(data: IPayment): Promise<IPaymentWithId> {
    const doc = await this.paymentModel.create(data);
    return toPaymentWithId(doc);
  }

  public async findPaymentById(id: string): Promise<IPaymentWithId | null> {
    const doc = await this.paymentModel.findById(id).lean();
    return doc ? toPaymentWithId(doc) : null;
  }

  public async findPaymentByIdempotencyKey(idempotencyKey: string): Promise<IPaymentWithId | null> {
    const doc = await this.paymentModel.findOne({ idempotencyKey }).lean();
    return doc ? toPaymentWithId(doc) : null;
  }

  public async updatePayment(id: string, data: Partial<IPayment>): Promise<IPaymentWithId | null> {
    const doc = await this.paymentModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? toPaymentWithId(doc) : null;
  }

  // Revenue Ledger Entries
  public async createLedgerEntry(data: IRevenueLedgerEntry): Promise<IRevenueLedgerEntryWithId> {
    const doc = await this.ledgerModel.create(data);
    return doc.toObject() as any;
  }

  public async findLedgerEntriesByPartner(partnerId: string): Promise<IRevenueLedgerEntryWithId[]> {
    return this.ledgerModel.find({ partnerId }).lean() as any;
  }

  // Partner Statements
  public async createStatement(data: IPartnerStatement): Promise<IPartnerStatementWithId> {
    const doc = await this.statementModel.create(data);
    return doc.toObject() as any;
  }

  public async findStatementById(id: string): Promise<IPartnerStatementWithId | null> {
    const doc = await this.statementModel.findById(id).lean();
    return doc ? (doc as any) : null;
  }

  public async updateStatement(id: string, data: Partial<IPartnerStatement>): Promise<IPartnerStatementWithId | null> {
    const doc = await this.statementModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? (doc as any) : null;
  }

  // Payouts
  public async createPayout(data: IPartnerPayout): Promise<IPartnerPayoutWithId> {
    const doc = await this.payoutModel.create(data);
    return doc.toObject() as any;
  }

  public async findPayoutById(id: string): Promise<IPartnerPayoutWithId | null> {
    const doc = await this.payoutModel.findById(id).lean();
    return doc ? (doc as any) : null;
  }

  public async updatePayout(id: string, data: Partial<IPartnerPayout>): Promise<IPartnerPayoutWithId | null> {
    const doc = await this.payoutModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? (doc as any) : null;
  }
}
