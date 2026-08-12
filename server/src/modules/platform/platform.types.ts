import { Types } from "mongoose";

export interface IAuditLog {
  actorUserId: Types.ObjectId;
  action: string;
  entityType: string;
  entityId: Types.ObjectId;
  before?: unknown;
  after?: unknown;
  reason?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface IAuditLogWithId extends Omit<IAuditLog, "actorUserId" | "entityId"> {
  id: string;
  actorUserId: string;
  entityId: string;
  createdAt: Date;
  updatedAt: Date;
}
