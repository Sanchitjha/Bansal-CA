import { Types } from "mongoose";

export interface ILeadContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
}

export interface ILead {
  leadNumber: string;
  source: "WEBSITE" | "PARTNER_PORTAL" | "ADMIN_PORTAL";
  partnerId?: Types.ObjectId | null;
  clientId?: Types.ObjectId | null;
  contactSnapshot: ILeadContact;
  serviceId: Types.ObjectId;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
  assignedTo?: Types.ObjectId | null;
  notes?: string;
  convertedAt?: Date;
  convertedCaseId?: Types.ObjectId | null;
}

export interface ILeadWithId extends Omit<ILead, "partnerId" | "clientId" | "serviceId" | "assignedTo" | "convertedCaseId"> {
  id: string;
  partnerId?: string | null;
  clientId?: string | null;
  serviceId: string;
  assignedTo?: string | null;
  convertedCaseId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
