import { Schema, model, Document, Types } from "mongoose";

export interface ICaseStatusHistory extends Document {
  caseId: Types.ObjectId;
  actorId?: Types.ObjectId;
  actorType: "USER" | "SYSTEM" | "PARTNER" | "CUSTOMER";
  previousStatus: string;
  newStatus: string;
  reason?: string;
  correlationId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface ICaseAssignmentHistory extends Document {
  caseId: Types.ObjectId;
  assignedBy?: Types.ObjectId;
  previousPartnerId?: Types.ObjectId;
  newPartnerId?: Types.ObjectId;
  previousAssignedTo?: Types.ObjectId;
  newAssignedTo?: Types.ObjectId;
  reason?: string;
  createdAt: Date;
}

const caseStatusHistorySchema = new Schema<ICaseStatusHistory>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
    actorType: {
      type: String,
      enum: ["USER", "SYSTEM", "PARTNER", "CUSTOMER"],
      default: "SYSTEM",
      required: true,
    },
    previousStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    reason: { type: String, trim: true },
    correlationId: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const caseAssignmentHistorySchema = new Schema<ICaseAssignmentHistory>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
    previousPartnerId: { type: Schema.Types.ObjectId, ref: "Partner" },
    newPartnerId: { type: Schema.Types.ObjectId, ref: "Partner" },
    previousAssignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    newAssignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    reason: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const CaseStatusHistoryModel = model<ICaseStatusHistory>("CaseStatusHistory", caseStatusHistorySchema);
export const CaseAssignmentHistoryModel = model<ICaseAssignmentHistory>("CaseAssignmentHistory", caseAssignmentHistorySchema);
