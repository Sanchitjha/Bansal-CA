import { Schema, model, Document, Types } from "mongoose";

export type RoutingStrategy = "ROUND_ROBIN" | "WEIGHTED" | "PRIORITY" | "LEAST_LOADED" | "GEOGRAPHIC" | "HYBRID";

export interface IRoutingRule extends Document {
  serviceId: Types.ObjectId;
  name: string;
  priority: number;
  isActive: boolean;
  partnerPool: Types.ObjectId[];
  allowedStates?: string[];
  allowedCities?: string[];
  allowedPincodes?: string[];
  strategy: RoutingStrategy;
  maxActiveWorkloadPerPartner?: number;
  fallbackStrategy?: RoutingStrategy;
  createdAt: Date;
  updatedAt: Date;
}

const routingRuleSchema = new Schema<IRoutingRule>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true, index: true },
    name: { type: String, required: true, trim: true },
    priority: { type: Number, default: 1, required: true },
    isActive: { type: Boolean, default: true },
    partnerPool: [{ type: Schema.Types.ObjectId, ref: "Partner" }],
    allowedStates: [{ type: String, trim: true }],
    allowedCities: [{ type: String, trim: true }],
    allowedPincodes: [{ type: String, trim: true }],
    strategy: {
      type: String,
      enum: ["ROUND_ROBIN", "WEIGHTED", "PRIORITY", "LEAST_LOADED", "GEOGRAPHIC", "HYBRID"],
      default: "LEAST_LOADED",
      required: true,
    },
    maxActiveWorkloadPerPartner: { type: Number, default: 50 },
    fallbackStrategy: {
      type: String,
      enum: ["ROUND_ROBIN", "WEIGHTED", "PRIORITY", "LEAST_LOADED", "GEOGRAPHIC", "HYBRID"],
      default: "ROUND_ROBIN",
    },
  },
  { timestamps: true }
);

routingRuleSchema.index({ serviceId: 1, priority: 1 });

export const RoutingRuleModel = model<IRoutingRule>("RoutingRule", routingRuleSchema);
