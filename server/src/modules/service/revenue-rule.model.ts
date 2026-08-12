import { model, Schema } from "mongoose";
import { IServiceRevenueRule } from "./service.types";

const serviceRevenueRuleSchema = new Schema<IServiceRevenueRule>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", default: null }, // Null means service-wide default
    ruleType: { type: String, enum: ["PERCENTAGE", "FIXED_AMOUNT"], required: true },
    value: { type: Number, required: true }, // percentage as float or amount in paise/cents
    tdsPercentage: { type: Number, default: 10, required: true }, // e.g. 10%
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date, default: null },
    version: { type: Number, required: true },
  },
  { timestamps: true }
);

serviceRevenueRuleSchema.index({ serviceId: 1, partnerId: 1, version: 1 }, { unique: true });
serviceRevenueRuleSchema.index({ effectiveFrom: 1, effectiveTo: 1 });

export const ServiceRevenueRuleModel = model<IServiceRevenueRule>(
  "ServiceRevenueRule",
  serviceRevenueRuleSchema
);
