import { Schema, model, Document, Types } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId;
  caseId?: Types.ObjectId;
  channel: "EMAIL" | "SMS" | "IN_APP" | "PUSH";
  event: string; // e.g. REQUEST_SUBMITTED, REQUEST_ASSIGNED, PAYMENT_CONFIRMED, COMMISSION_CREATED
  title: string;
  message: string;
  recipient: string; // Email or phone number
  status: "PENDING" | "SENT" | "FAILED";
  errorDetails?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    caseId: { type: Schema.Types.ObjectId, ref: "Case", index: true },
    channel: {
      type: String,
      enum: ["EMAIL", "SMS", "IN_APP", "PUSH"],
      default: "IN_APP",
      required: true,
    },
    event: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    recipient: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING",
      required: true,
    },
    errorDetails: { type: String },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, status: 1 });

export const NotificationModel = model<INotification>("Notification", notificationSchema);
