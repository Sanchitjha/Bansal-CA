import { Types } from "mongoose";
import { AuditLogModel } from "./audit-log.model";
import { logger } from "../../config/logger";

export interface ILogAuditParams {
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: any;
  after?: any;
  reason?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogService {
  public async log(params: ILogAuditParams): Promise<void> {
    try {
      await AuditLogModel.create({
        actorUserId: new Types.ObjectId(params.actorUserId),
        action: params.action,
        entityType: params.entityType,
        entityId: new Types.ObjectId(params.entityId),
        before: params.before,
        after: params.after,
        reason: params.reason,
        requestId: params.requestId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });
    } catch (err) {
      logger.error("Failed to write audit log entry", { error: err });
    }
  }
}
