import { model, Schema } from "mongoose";
import { IPartnerStatement } from "./finance.types";

const statementLineItemSchema = new Schema({
  caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
  revenueLedgerEntryId: { type: Schema.Types.ObjectId, ref: "RevenueLedgerEntry", required: true },
  grossAmountMinor: { type: Number, required: true },
  eligibleRevenueMinor: { type: Number, required: true },
  partnerShareMinor: { type: Number, required: true },
  adjustmentsMinor: { type: Number, default: 0, required: true },
  tdsMinor: { type: Number, default: 0, required: true },
  netPayableMinor: { type: Number, required: true },
});

const partnerStatementSchema = new Schema<IPartnerStatement>(
  {
    statementNumber: { type: String, required: true, unique: true, trim: true },
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    lineItems: [statementLineItemSchema],
    totals: {
      grossMinor: { type: Number, required: true },
      eligibleRevenueMinor: { type: Number, required: true },
      partnerShareMinor: { type: Number, required: true },
      adjustmentsMinor: { type: Number, default: 0, required: true },
      tdsMinor: { type: Number, default: 0, required: true },
      netPayableMinor: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: [
        "DRAFT",
        "UNDER_REVIEW",
        "ISSUED",
        "PARTNER_ACCEPTED",
        "T2_ELIGIBLE",
        "SCHEDULED",
        "PAID",
        "DISPUTED",
      ],
      default: "DRAFT",
      required: true,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
);

partnerStatementSchema.index({ partnerId: 1, periodStart: 1, periodEnd: 1 });
partnerStatementSchema.index({ status: 1 });

export const PartnerStatementModel = model<IPartnerStatement>(
  "PartnerStatement",
  partnerStatementSchema
);
