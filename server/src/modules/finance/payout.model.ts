import { model, Schema } from "mongoose";
import { IPartnerPayout } from "./finance.types";

const partnerPayoutSchema = new Schema<IPartnerPayout>(
  {
    payoutNumber: { type: String, required: true, unique: true, trim: true },
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", required: true },
    statementId: { type: Schema.Types.ObjectId, ref: "PartnerStatement", required: true },
    amountMinor: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SCHEDULED", "PAID", "FAILED", "ON_HOLD"],
      default: "PENDING",
      required: true,
    },
    scheduledAt: { type: Date },
    paidAt: { type: Date },
    paymentReference: { type: String, trim: true },
    utr: { type: String, trim: true },
    proofDocumentId: { type: Schema.Types.ObjectId, ref: "Document" }, // Links to polymorphic Document
    holdReason: { type: String, trim: true },
  },
  { timestamps: true }
);

partnerPayoutSchema.index({ partnerId: 1, status: 1 });
partnerPayoutSchema.index({ statementId: 1 });

export const PartnerPayoutModel = model<IPartnerPayout>("PartnerPayout", partnerPayoutSchema);
