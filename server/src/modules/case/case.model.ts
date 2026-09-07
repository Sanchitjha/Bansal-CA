import { model, Schema } from "mongoose";
import { ICase } from "./case.types";

const caseSchema = new Schema<ICase>(
  {
    caseNumber: { type: String, required: true, unique: true, trim: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", default: null },
    source: { type: String, enum: ["WEBSITE", "PARTNER", "ADMIN"], required: true },
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", default: null },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    serviceVersionId: { type: Schema.Types.ObjectId, ref: "ServiceVersion", default: null },
    formSchemaVersion: { type: Number, default: 1 },
    submittedFormData: { type: Schema.Types.Mixed },

    serviceSnapshot: {
      code: { type: String, required: true, trim: true },
      name: { type: String, required: true, trim: true },
      category: { type: String, required: true, trim: true },
    },
    pricingSnapshot: {
      pricingType: {
        type: String,
        enum: ["FIXED", "STARTING_FROM", "QUOTE_BASED"],
        required: true,
      },
      amountMinor: { type: Number, required: true },
      currency: { type: String, required: true, trim: true },
    },
    revenueRuleSnapshot: {
      ruleType: { type: String, enum: ["PERCENTAGE", "FIXED_AMOUNT", "HYBRID", "SLAB"], required: true },
      value: { type: Number, required: true },
      tdsPercentage: { type: Number, required: true },
    },
    workflowSnapshot: { type: Schema.Types.Mixed, required: true },

    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED",
        "ASSIGNED",
        "IN_REVIEW",
        "MORE_INFO",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
        "EXCEPTION",
        "CANCELLED",
        "CLOSED",
        "NEW",
        "PAYMENT_PENDING",
        "OPEN",
        "IN_PROCESS",
        "WAITING_FOR_CLIENT",
        "WAITING_FOR_PARTNER",
        "REVIEW",
      ],
      default: "DRAFT",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PARTIALLY_PAID", "PAID", "REFUNDED"],
      default: "PENDING",
      required: true,
    },
    invoiceStatus: {
      type: String,
      enum: ["UNISSUED", "ISSUED", "SETTLED", "CANCELLED"],
      default: "UNISSUED",
      required: true,
    },
    revenueShareStatus: {
      type: String,
      enum: ["NOT_ELIGIBLE", "PENDING", "CREDITED", "PAID", "REVERSED"],
      default: "NOT_ELIGIBLE",
      required: true,
    },
    openedAt: { type: Date, default: Date.now, required: true },
    dueAt: { type: Date },
    closedAt: { type: Date },
    notes: { type: String, trim: true },
    internalNotes: { type: String, trim: true },
    customerNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

caseSchema.index({ clientId: 1, status: 1 });
caseSchema.index({ partnerId: 1, status: 1 });
caseSchema.index({ assignedTo: 1, status: 1 });
caseSchema.index({ caseNumber: 1 });

export const CaseModel = model<ICase>("Case", caseSchema);
