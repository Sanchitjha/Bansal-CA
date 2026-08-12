import { model, Schema } from "mongoose";
import { ILead } from "./lead.types";

const leadSchema = new Schema<ILead>(
  {
    leadNumber: { type: String, required: true, unique: true, trim: true },
    source: {
      type: String,
      enum: ["WEBSITE", "PARTNER_PORTAL", "ADMIN_PORTAL"],
      required: true,
    },
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", default: null },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", default: null },
    contactSnapshot: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      companyName: { type: String, trim: true },
    },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"],
      default: "NEW",
      required: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    notes: { type: String, trim: true },
    convertedAt: { type: Date },
    convertedCaseId: { type: Schema.Types.ObjectId, ref: "Case", default: null },
  },
  { timestamps: true }
);

leadSchema.index({ partnerId: 1, status: 1 });
leadSchema.index({ clientId: 1, status: 1 });

export const LeadModel = model<ILead>("Lead", leadSchema);
