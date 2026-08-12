import { Types } from "mongoose";

export interface IInvoice {
  invoiceNumber: string;
  caseId: Types.ObjectId;
  clientId: Types.ObjectId;
  amountMinor: number; // Stored in paise/cents
  taxAmountMinor: number;
  totalAmountMinor: number; // amountMinor + taxAmountMinor
  currency: string;
  status: "DRAFT" | "ISSUED" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "CANCELLED";
  dueAt: Date;
  issuedAt?: Date;
  paidAt?: Date;
}

export interface IPayment {
  paymentNumber: string;
  caseId: Types.ObjectId;
  invoiceId?: Types.ObjectId | null;
  clientId: Types.ObjectId;
  partnerId?: Types.ObjectId | null; // Null for direct client
  amountMinor: number;
  currency: string;
  method: string; // "NET_BANKING", "UPI", "CARD"
  gateway: string; // "RAZORPAY", "STRIPE"
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  status: "CREATED" | "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  idempotencyKey: string;
  verifiedAt?: Date;
}

export interface IRevenueLedgerEntry {
  partnerId: Types.ObjectId;
  caseId: Types.ObjectId;
  paymentId: Types.ObjectId;
  entryType: "EARNING" | "ADJUSTMENT" | "TDS" | "PAYOUT" | "REFUND_REVERSAL";
  grossAmountMinor: number;
  eligibleRevenueMinor: number;
  partnerShareMinor: number;
  tdsAmountMinor: number;
  otherDeductionMinor: number;
  netPayableMinor: number;
  ruleSnapshot: {
    ruleType: "PERCENTAGE" | "FIXED_AMOUNT";
    value: number;
    tdsPercentage: number;
  };
  statementId?: Types.ObjectId | null;
  status: "PENDING" | "BILLED" | "PAID" | "HELD";
  adjustmentReason?: string;
}

export interface IStatementLineItem {
  caseId: Types.ObjectId;
  revenueLedgerEntryId: Types.ObjectId;
  grossAmountMinor: number;
  eligibleRevenueMinor: number;
  partnerShareMinor: number;
  adjustmentsMinor: number;
  tdsMinor: number;
  netPayableMinor: number;
}

export interface IPartnerStatement {
  statementNumber: string;
  partnerId: Types.ObjectId;
  periodStart: Date;
  periodEnd: Date;
  lineItems: IStatementLineItem[];
  totals: {
    grossMinor: number;
    eligibleRevenueMinor: number;
    partnerShareMinor: number;
    adjustmentsMinor: number;
    tdsMinor: number;
    netPayableMinor: number;
  };
  status:
    | "DRAFT"
    | "UNDER_REVIEW"
    | "ISSUED"
    | "PARTNER_ACCEPTED"
    | "T2_ELIGIBLE"
    | "SCHEDULED"
    | "PAID"
    | "DISPUTED";
  reviewedBy?: Types.ObjectId | null;
  reviewedAt?: Date;
  acceptedAt?: Date;
}

export interface IPartnerPayout {
  payoutNumber: string;
  partnerId: Types.ObjectId;
  statementId: Types.ObjectId;
  amountMinor: number;
  status: "PENDING" | "SCHEDULED" | "PAID" | "FAILED" | "ON_HOLD";
  scheduledAt?: Date;
  paidAt?: Date;
  paymentReference?: string;
  utr?: string;
  proofDocumentId?: Types.ObjectId; // Links to polymorphic Document
  holdReason?: string;
}

export interface IInvoiceWithId extends Omit<IInvoice, "caseId" | "clientId"> {
  id: string;
  caseId: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentWithId extends Omit<IPayment, "caseId" | "invoiceId" | "clientId" | "partnerId"> {
  id: string;
  caseId: string;
  invoiceId?: string | null;
  clientId: string;
  partnerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRevenueLedgerEntryWithId extends Omit<IRevenueLedgerEntry, "partnerId" | "caseId" | "paymentId" | "statementId"> {
  id: string;
  partnerId: string;
  caseId: string;
  paymentId: string;
  statementId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPartnerStatementWithId extends Omit<IPartnerStatement, "partnerId" | "lineItems" | "reviewedBy"> {
  id: string;
  partnerId: string;
  lineItems: Array<Omit<IStatementLineItem, "caseId" | "revenueLedgerEntryId"> & { caseId: string; revenueLedgerEntryId: string }>;
  reviewedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPartnerPayoutWithId extends Omit<IPartnerPayout, "partnerId" | "statementId" | "proofDocumentId"> {
  id: string;
  partnerId: string;
  statementId: string;
  proofDocumentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
