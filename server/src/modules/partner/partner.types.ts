import { Types } from "mongoose";

export interface IBankAccount {
  accountHolderName: string;
  accountNumberEncrypted: string;
  bankName: string;
  branchName: string;
  ifsc: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  isPrimary: boolean;
}

export interface IPartnerKyc {
  legalName: string;
  registrationNumber?: string;
  taxIdentifiers: {
    pan: string;
    gstin?: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
}

export interface IPartner {
  userId: Types.ObjectId;
  partnerCode: string;
  partnerType: "INDIVIDUAL" | "AGENCY";
  legalName: string;
  displayName: string;
  contact: {
    email: string;
    phone: string;
  };
  status: "DRAFT" | "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "REJECTED";
  kyc: IPartnerKyc;
  bankAccounts: IBankAccount[];
  onboarding: {
    submittedAt?: Date;
    verifiedAt?: Date;
    verifiedBy?: Types.ObjectId;
  };
}

export interface IPartnerWithId extends Omit<IPartner, "userId" | "bankAccounts" | "onboarding"> {
  id: string;
  userId: string;
  bankAccounts: Array<Omit<IBankAccount, "verifiedBy"> & { verifiedBy?: string }>;
  onboarding: Omit<IPartner["onboarding"], "verifiedBy"> & { verifiedBy?: string };
  createdAt: Date;
  updatedAt: Date;
}
