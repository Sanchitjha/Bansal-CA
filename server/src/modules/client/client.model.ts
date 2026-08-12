import { model, Schema } from "mongoose";
import { IClient } from "./client.types";

const clientSchema = new Schema<IClient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    clientCode: { type: String, required: true, unique: true, trim: true },
    clientType: { type: String, enum: ["INDIVIDUAL", "BUSINESS"], required: true },
    acquisitionSource: { type: String, enum: ["SELF", "PARTNER"], required: true },
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", default: null },
    legalName: { type: String, required: true, trim: true },
    contact: {
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      required: true,
    },
  },
  { timestamps: true }
);

clientSchema.index({ partnerId: 1 });
clientSchema.index({ status: 1 });

export const ClientModel = model<IClient>("Client", clientSchema);
