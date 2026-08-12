import { model, Schema } from "mongoose";
import { IInvoice } from "./finance.types";

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    amountMinor: { type: Number, required: true },
    taxAmountMinor: { type: Number, required: true },
    totalAmountMinor: { type: Number, required: true },
    currency: { type: String, default: "INR", required: true, trim: true },
    status: {
      type: String,
      enum: ["DRAFT", "ISSUED", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"],
      default: "DRAFT",
      required: true,
    },
    dueAt: { type: Date, required: true },
    issuedAt: { type: Date },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

invoiceSchema.index({ caseId: 1 });
invoiceSchema.index({ clientId: 1, status: 1 });

export const InvoiceModel = model<IInvoice>("Invoice", invoiceSchema);
