import { Types } from "mongoose";

export interface IDocumentRequirement {
  documentType: string;
  label: string;
  required: boolean;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  expiryRequired: boolean;
  sortOrder: number;
}

export interface ITaskConfig {
  taskCode: string;
  name: string;
  assignedRole: string; // CLIENT, PARTNER, CORE_TEAM
  required: boolean;
  dueOffsetDays: number;
}

export interface IWorkflowStage {
  stageCode: string;
  name: string;
  sortOrder: number;
  tasks: ITaskConfig[];
}

export interface IService {
  code: string;
  name: string;
  category: string;
  description?: string;
  publicVisibility: boolean;
  clientAvailability: boolean;
  partnerAvailability: boolean;
  status: "ACTIVE" | "INACTIVE";
  sortOrder: number;
  documentRequirements: IDocumentRequirement[];
  workflow: IWorkflowStage[];
  slaDays: number;
}

export interface IServicePricing {
  serviceId: Types.ObjectId;
  pricingType: "FIXED" | "STARTING_FROM" | "QUOTE_BASED";
  amountMinor: number; // Stored in paise/cents
  currency: string; // e.g., "INR"
  effectiveFrom: Date;
  effectiveTo?: Date | null;
  version: number;
  status: "ACTIVE" | "DEPRECATED";
}

export interface IServiceRevenueRule {
  serviceId: Types.ObjectId;
  partnerId?: Types.ObjectId | null; // Null means service-wide default
  ruleType: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number; // Share percentage or minor units amount
  tdsPercentage: number;
  effectiveFrom: Date;
  effectiveTo?: Date | null;
  version: number;
}

export interface IServiceWithId extends IService {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IServicePricingWithId extends Omit<IServicePricing, "serviceId"> {
  id: string;
  serviceId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IServiceRevenueRuleWithId extends Omit<IServiceRevenueRule, "serviceId" | "partnerId"> {
  id: string;
  serviceId: string;
  partnerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
