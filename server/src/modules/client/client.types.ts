import { Types } from "mongoose";

export interface IClient {
  userId: Types.ObjectId;
  clientCode: string;
  clientType: "INDIVIDUAL" | "BUSINESS";
  acquisitionSource: "SELF" | "PARTNER";
  partnerId?: Types.ObjectId | null; // Null for direct client
  legalName: string;
  contact: {
    email: string;
    phone: string;
  };
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface IClientWithId extends Omit<IClient, "userId" | "partnerId"> {
  id: string;
  userId: string;
  partnerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
