import { Schema, model } from "mongoose";
import { IPartner } from "./partner.types";

const bankAccountSchema = new Schema({
  accountHolderName: { type: String, required: true, trim: true },
  accountNumberEncrypted: { type: String, required: true },
  bankName: { type: String, required: true, trim: true },
  branchName: { type: String, required: true, trim: true },
  ifsc: { type: String, required: true, trim: true },
  verificationStatus: {
    type: String,
    enum: ["PENDING", "VERIFIED", "REJECTED"],
    default: "PENDING",
    required: true,
  },
  verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  verifiedAt: Date,
  isPrimary: { type: Boolean, default: false, required: true },
});

const partnerKycSchema = new Schema({
  legalName: { type: String, required: true, trim: true },
  registrationNumber: { type: String, trim: true },
  taxIdentifiers: {
    pan: { type: String, required: true, trim: true },
    gstin: { type: String, trim: true },
  },
  address: {
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  verificationStatus: {
    type: String,
    enum: ["PENDING", "VERIFIED", "REJECTED"],
    default: "PENDING",
    required: true,
  },
});

const partnerSchema = new Schema<IPartner>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    partnerCode: { type: String, required: true, unique: true, trim: true },
    partnerType: { type: String, enum: ["INDIVIDUAL", "AGENCY"], required: true },
    legalName: { type: String, required: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    contact: {
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
    },
    status: {
      type: String,
      enum: ["DRAFT", "PENDING_VERIFICATION", "ACTIVE", "SUSPENDED", "REJECTED"],
      default: "DRAFT",
      required: true,
    },
    kyc: { type: partnerKycSchema, required: true },
    bankAccounts: [bankAccountSchema],
    onboarding: {
      submittedAt: Date,
      verifiedAt: Date,
      verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true }
);

partnerSchema.index({ status: 1 });

export const PartnerModel = model<IPartner>("Partner", partnerSchema);
