import { Types } from "mongoose";

export interface IServiceSnapshot {
  code: string;
  name: string;
  category: string;
}

export interface IPricingSnapshot {
  pricingType: "FIXED" | "STARTING_FROM" | "QUOTE_BASED";
  amountMinor: number;
  currency: string;
}

export interface IRevenueRuleSnapshot {
  ruleType: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  tdsPercentage: number;
}

export interface ICase {
  caseNumber: string;
  leadId?: Types.ObjectId | null;
  source: "WEBSITE" | "PARTNER" | "ADMIN";
  partnerId?: Types.ObjectId | null;
  clientId: Types.ObjectId;
  serviceId: Types.ObjectId;
  
  serviceSnapshot: IServiceSnapshot;
  pricingSnapshot: IPricingSnapshot;
  revenueRuleSnapshot: IRevenueRuleSnapshot;
  workflowSnapshot: unknown; // Frozen stages/tasks structure

  assignedTo?: Types.ObjectId | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status:
    | "NEW"
    | "PAYMENT_PENDING"
    | "OPEN"
    | "IN_PROCESS"
    | "WAITING_FOR_CLIENT"
    | "WAITING_FOR_PARTNER"
    | "REVIEW"
    | "CLOSED"
    | "CANCELLED";
  paymentStatus: "PENDING" | "PARTIALLY_PAID" | "PAID" | "REFUNDED";
  invoiceStatus: "UNISSUED" | "ISSUED" | "SETTLED" | "CANCELLED";
  revenueShareStatus: "NOT_ELIGIBLE" | "PENDING" | "CREDITED" | "PAID" | "REVERSED";
  openedAt: Date;
  dueAt?: Date;
  closedAt?: Date;
  notes?: string;
}

export interface ICaseWithId extends Omit<ICase, "leadId" | "partnerId" | "clientId" | "serviceId" | "assignedTo"> {
  id: string;
  leadId?: string | null;
  partnerId?: string | null;
  clientId: string;
  serviceId: string;
  assignedTo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICaseTask {
  caseId: Types.ObjectId;
  title: string;
  description?: string;
  assignedToUserId?: Types.ObjectId | null;
  assignedRole: string; // "CLIENT" | "PARTNER" | "CORE_TEAM"
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED" | "OVERDUE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueAt: Date;
  completedAt?: Date;
  completedBy?: Types.ObjectId;
  completionRequirements: {
    requiresDocument: boolean;
    requiresNote: boolean;
    requiresApproval: boolean;
  };
}

export interface ICaseTaskWithId extends Omit<ICaseTask, "caseId" | "assignedToUserId" | "completedBy"> {
  id: string;
  caseId: string;
  assignedToUserId?: string | null;
  completedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocument {
  ownerId: Types.ObjectId; // Can be Partner ID, Client ID, or Case ID
  ownerType: "PARTNER" | "CLIENT" | "CASE";
  documentType: string;
  fileId: string;
  storageKey: string;
  originalFileName: string;
  status:
    | "REQUESTED"
    | "UPLOADED"
    | "UNDER_REVIEW"
    | "ACCEPTED"
    | "REJECTED"
    | "RE_UPLOAD_REQUIRED";
  uploadedBy?: Types.ObjectId | null;
  reviewedBy?: Types.ObjectId | null;
  reviewedAt?: Date;
  rejectionReason?: string;
  expiresAt?: Date;
}

export interface IDocumentWithId extends Omit<IDocument, "ownerId" | "uploadedBy" | "reviewedBy"> {
  id: string;
  ownerId: string;
  uploadedBy?: string | null;
  reviewedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
