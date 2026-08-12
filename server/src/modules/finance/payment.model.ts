import { model, Schema } from "mongoose";
import { IPayment } from "./finance.types";

const paymentSchema = new Schema<IPayment>(
  {
    paymentNumber: { type: String, required: true, unique: true, trim: true },
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", default: null },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", default: null },
    amountMinor: { type: Number, required: true },
    currency: { type: String, default: "INR", required: true, trim: true },
    method: { type: String, required: true, trim: true },
    gateway: { type: String, required: true, trim: true },
    gatewayOrderId: { type: String, required: true, trim: true },
    gatewayPaymentId: { type: String, unique: true, sparse: true, trim: true },
    status: {
      type: String,
      enum: ["CREATED", "PENDING", "SUCCESS", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"],
      default: "CREATED",
      required: true,
    },
    idempotencyKey: { type: String, required: true, unique: true, trim: true },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

paymentSchema.index({ caseId: 1 });
paymentSchema.index({ gatewayOrderId: 1 });

export const PaymentModel = model<IPayment>("Payment", paymentSchema);
