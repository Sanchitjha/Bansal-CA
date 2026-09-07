import { Types } from "mongoose";
import { NotificationModel } from "./notification.model";
import { logger } from "../../config/logger";

export interface ISendNotificationParams {
  userId: string;
  caseId?: string;
  channel?: "EMAIL" | "SMS" | "IN_APP" | "PUSH";
  event: string;
  title: string;
  message: string;
  recipient: string;
}

export class NotificationService {
  public async sendNotification(params: ISendNotificationParams): Promise<any> {
    try {
      const notification = await NotificationModel.create({
        userId: new Types.ObjectId(params.userId),
        caseId: params.caseId ? new Types.ObjectId(params.caseId) : undefined,
        channel: params.channel || "IN_APP",
        event: params.event,
        title: params.title,
        message: params.message,
        recipient: params.recipient,
        status: "SENT",
        sentAt: new Date(),
      });

      logger.info(`Notification Service: Outbound ${params.channel || "IN_APP"} sent to ${params.recipient} [Event: ${params.event}]`);
      return notification;
    } catch (err: any) {
      logger.error("Notification delivery failed", { error: err });
      return NotificationModel.create({
        userId: new Types.ObjectId(params.userId),
        caseId: params.caseId ? new Types.ObjectId(params.caseId) : undefined,
        channel: params.channel || "IN_APP",
        event: params.event,
        title: params.title,
        message: params.message,
        recipient: params.recipient,
        status: "FAILED",
        errorDetails: err.message,
      });
    }
  }
}
