import { model, Schema } from "mongoose";
import { IRevenueLedgerEntry } from "./finance.types";

const revenueLedgerEntrySchema = new Schema<IRevenueLedgerEntry>(
  {
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", required: true },
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    entryType: {
      type: String,
      enum: ["EARNING", "ADJUSTMENT", "TDS", "PAYOUT", "REFUND_REVERSAL"],
      required: true,
    },
    grossAmountMinor: { type: Number, required: true },
    eligibleRevenueMinor: { type: Number, required: true },
    partnerShareMinor: { type: Number, required: true },
    tdsAmountMinor: { type: Number, default: 0, required: true },
    otherDeductionMinor: { type: Number, default: 0, required: true },
    netPayableMinor: { type: Number, required: true },
    ruleSnapshot: {
      ruleType: { type: String, enum: ["PERCENTAGE", "FIXED_AMOUNT", "HYBRID", "SLAB"], required: true },
      value: { type: Number, required: true },
      tdsPercentage: { type: Number, required: true },
    },
    statementId: { type: Schema.Types.ObjectId, ref: "PartnerStatement", default: null },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "PAYABLE", "PAID", "REVERSED", "DISPUTED", "BILLED", "HELD"],
      default: "PENDING",
      required: true,
    },
    adjustmentReason: { type: String, trim: true },
  },
  { timestamps: true }
);

revenueLedgerEntrySchema.index({ partnerId: 1, createdAt: 1 });
revenueLedgerEntrySchema.index({ caseId: 1 });
revenueLedgerEntrySchema.index({ statementId: 1 });
revenueLedgerEntrySchema.index({ status: 1 });

export const RevenueLedgerEntryModel = model<IRevenueLedgerEntry>(
  "RevenueLedgerEntry",
  revenueLedgerEntrySchema
);
