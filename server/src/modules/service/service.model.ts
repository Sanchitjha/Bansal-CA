import { model, Schema } from "mongoose";
import { IService } from "./service.types";

const documentRequirementSchema = new Schema({
  documentType: { type: String, required: true, trim: true },
  label: { type: String, required: true, trim: true },
  required: { type: Boolean, default: true, required: true },
  allowedFileTypes: [{ type: String, trim: true }],
  maxFileSize: { type: Number },
  expiryRequired: { type: Boolean, default: false, required: true },
  sortOrder: { type: Number, default: 0, required: true },
});

const taskConfigSchema = new Schema({
  taskCode: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  assignedRole: { type: String, required: true, trim: true },
  required: { type: Boolean, default: true, required: true },
  dueOffsetDays: { type: Number, default: 7, required: true },
});

const workflowStageSchema = new Schema({
  stageCode: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  sortOrder: { type: Number, default: 0, required: true },
  tasks: [taskConfigSchema],
});

const serviceSchema = new Schema<IService>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    publicVisibility: { type: Boolean, default: true, required: true },
    clientAvailability: { type: Boolean, default: true, required: true },
    partnerAvailability: { type: Boolean, default: true, required: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE", required: true },
    sortOrder: { type: Number, default: 0, required: true },
    documentRequirements: [documentRequirementSchema],
    workflow: [workflowStageSchema],
    slaDays: { type: Number, default: 15, required: true },
  },
  { timestamps: true }
);

serviceSchema.index({ status: 1, sortOrder: 1 });

export const ServiceModel = model<IService>("Service", serviceSchema);
