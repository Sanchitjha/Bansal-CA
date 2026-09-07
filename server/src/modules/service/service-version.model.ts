import { Schema, model, Document, Types } from "mongoose";

export interface IServiceVersion extends Document {
  serviceId: Types.ObjectId;
  versionNumber: number;
  formSchemaId?: Types.ObjectId;
  documentRequirements: Array<{
    documentType: string;
    label: string;
    required: boolean;
    allowedFormats?: string[];
    maxSizeBytes?: number;
  }>;
  workflow: Array<{
    stageCode: string;
    name: string;
    sortOrder: number;
  }>;
  slaDays: number;
  changeSummary?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceVersionSchema = new Schema<IServiceVersion>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true, index: true },
    versionNumber: { type: Number, required: true },
    formSchemaId: { type: Schema.Types.ObjectId, ref: "FormSchema" },
    documentRequirements: [
      {
        documentType: { type: String, required: true },
        label: { type: String, required: true },
        required: { type: Boolean, default: true },
        allowedFormats: [{ type: String }],
        maxSizeBytes: { type: Number },
      },
    ],
    workflow: [
      {
        stageCode: { type: String, required: true },
        name: { type: String, required: true },
        sortOrder: { type: Number, required: true },
      },
    ],
    slaDays: { type: Number, default: 5 },
    changeSummary: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceVersionSchema.index({ serviceId: 1, versionNumber: 1 }, { unique: true });

export const ServiceVersionModel = model<IServiceVersion>("ServiceVersion", serviceVersionSchema);
