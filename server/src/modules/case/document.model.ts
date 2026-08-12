import { model, Schema } from "mongoose";
import { IDocument } from "./case.types";

const documentSchema = new Schema<IDocument>(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true }, // Polymorphic key (Partner, Client, or Case ID)
    ownerType: {
      type: String,
      enum: ["PARTNER", "CLIENT", "CASE"],
      required: true,
    },
    documentType: { type: String, required: true, trim: true },
    fileId: { type: String, required: true, trim: true },
    storageKey: { type: String, required: true, trim: true },
    originalFileName: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: [
        "REQUESTED",
        "UPLOADED",
        "UNDER_REVIEW",
        "ACCEPTED",
        "REJECTED",
        "RE_UPLOAD_REQUIRED",
      ],
      default: "REQUESTED",
      required: true,
    },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date },
    rejectionReason: { type: String, trim: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

documentSchema.index({ ownerId: 1, ownerType: 1, status: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ expiresAt: 1 });

export const DocumentModel = model<IDocument>("Document", documentSchema);
