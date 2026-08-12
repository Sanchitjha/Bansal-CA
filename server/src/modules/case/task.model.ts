import { model, Schema } from "mongoose";
import { ICaseTask } from "./case.types";

const caseTaskSchema = new Schema<ICaseTask>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    assignedToUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    assignedRole: { type: String, required: true, trim: true }, // "CLIENT", "PARTNER", "CORE_TEAM"
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "BLOCKED", "OVERDUE"],
      default: "PENDING",
      required: true,
    },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "MEDIUM", required: true },
    dueAt: { type: Date, required: true },
    completedAt: { type: Date },
    completedBy: { type: Schema.Types.ObjectId, ref: "User" },
    completionRequirements: {
      requiresDocument: { type: Boolean, default: false, required: true },
      requiresNote: { type: Boolean, default: false, required: true },
      requiresApproval: { type: Boolean, default: false, required: true },
    },
  },
  { timestamps: true }
);

caseTaskSchema.index({ caseId: 1, status: 1 });
caseTaskSchema.index({ assignedToUserId: 1, status: 1 });
caseTaskSchema.index({ dueAt: 1 });

export const CaseTaskModel = model<ICaseTask>("CaseTask", caseTaskSchema);
