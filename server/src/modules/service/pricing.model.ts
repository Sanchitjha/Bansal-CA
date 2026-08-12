import { model, Schema } from "mongoose";
import { IServicePricing } from "./service.types";

const servicePricingSchema = new Schema<IServicePricing>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    pricingType: {
      type: String,
      enum: ["FIXED", "STARTING_FROM", "QUOTE_BASED"],
      required: true,
    },
    amountMinor: { type: Number, required: true }, // PAIS/CENTS
    currency: { type: String, default: "INR", required: true, trim: true },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date, default: null },
    version: { type: Number, required: true },
    status: { type: String, enum: ["ACTIVE", "DEPRECATED"], default: "ACTIVE", required: true },
  },
  { timestamps: true }
);

servicePricingSchema.index({ serviceId: 1, version: 1 }, { unique: true });
servicePricingSchema.index({ effectiveFrom: 1, effectiveTo: 1 });

export const ServicePricingModel = model<IServicePricing>("ServicePricing", servicePricingSchema);
