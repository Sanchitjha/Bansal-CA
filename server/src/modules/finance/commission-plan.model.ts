import { Schema, model, Document, Types } from "mongoose";

export interface ICommissionSlab {
  minRevenueMinor: number;
  maxRevenueMinor?: number;
  percentageRate: number;
  fixedBonusMinor: number;
}

export interface ICommissionPlan extends Document {
  serviceId?: Types.ObjectId;
  partnerId?: Types.ObjectId;
  name: string;
  ruleType: "PERCENTAGE" | "FIXED_AMOUNT" | "HYBRID" | "SLAB";
  defaultPercentageRate: number;
  defaultFixedAmountMinor: number;
  tdsPercentageRate: number;
  slabs: ICommissionSlab[];
  triggerEvent: "PAYMENT" | "COMPLETION";
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const commissionSlabSchema = new Schema<ICommissionSlab>({
  minRevenueMinor: { type: Number, required: true, default: 0 },
  maxRevenueMinor: { type: Number },
  percentageRate: { type: Number, required: true, default: 0 },
  fixedBonusMinor: { type: Number, required: true, default: 0 },
});

const commissionPlanSchema = new Schema<ICommissionPlan>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", index: true },
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", index: true },
    name: { type: String, required: true, trim: true },
    ruleType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED_AMOUNT", "HYBRID", "SLAB"],
      default: "PERCENTAGE",
      required: true,
    },
    defaultPercentageRate: { type: Number, default: 15, required: true },
    defaultFixedAmountMinor: { type: Number, default: 0, required: true },
    tdsPercentageRate: { type: Number, default: 10, required: true },
    slabs: [commissionSlabSchema],
    triggerEvent: {
      type: String,
      enum: ["PAYMENT", "COMPLETION"],
      default: "PAYMENT",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    effectiveFrom: { type: Date, default: Date.now, required: true },
    effectiveTo: { type: Date },
  },
  { timestamps: true }
);

commissionPlanSchema.index({ serviceId: 1, partnerId: 1, isActive: 1 });

export const CommissionPlanModel = model<ICommissionPlan>("CommissionPlan", commissionPlanSchema);
