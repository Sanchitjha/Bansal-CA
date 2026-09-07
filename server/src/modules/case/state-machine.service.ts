import { Types } from "mongoose";
import { BadRequestException } from "../../common/errors/http-exception";
import { CaseModel } from "./case.model";
import { CaseStatusHistoryModel } from "./case-history.model";
import { CaseStatus } from "./case.types";
import { logger } from "../../config/logger";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["SUBMITTED", "CANCELLED"],
  SUBMITTED: ["ASSIGNED", "EXCEPTION", "CANCELLED"],
  ASSIGNED: ["IN_REVIEW", "CANCELLED", "FAILED"],
  IN_REVIEW: ["MORE_INFO", "PROCESSING", "CANCELLED", "FAILED", "COMPLETED"],
  MORE_INFO: ["IN_REVIEW", "CANCELLED"],
  PROCESSING: ["COMPLETED", "FAILED"],
  COMPLETED: ["CLOSED", "IN_REVIEW"],
  FAILED: ["PROCESSING", "EXCEPTION", "CANCELLED"],
  EXCEPTION: ["ASSIGNED", "CANCELLED"],
  CANCELLED: [],
  CLOSED: ["IN_REVIEW"],
  // Legacy status support mappings
  NEW: ["SUBMITTED", "ASSIGNED", "PAYMENT_PENDING", "CANCELLED"],
  PAYMENT_PENDING: ["SUBMITTED", "ASSIGNED", "OPEN", "CANCELLED"],
  OPEN: ["IN_PROCESS", "IN_REVIEW", "REVIEW", "CANCELLED"],
  IN_PROCESS: ["PROCESSING", "REVIEW", "COMPLETED", "WAITING_FOR_CLIENT", "CLOSED"],
  WAITING_FOR_CLIENT: ["IN_PROCESS", "IN_REVIEW", "CANCELLED"],
  WAITING_FOR_PARTNER: ["IN_PROCESS", "IN_REVIEW", "CANCELLED"],
  REVIEW: ["COMPLETED", "CLOSED", "IN_PROCESS"],
};

export class StateMachineService {
  public validateTransition(currentStatus: string, nextStatus: CaseStatus): void {
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(nextStatus)) {
      throw new BadRequestException(
        `Invalid state transition from '${currentStatus}' to '${nextStatus}'. Allowed target states: [${allowed.join(", ")}]`
      );
    }
  }

  public async transitionState(
    caseId: string,
    nextStatus: CaseStatus,
    actorId?: string,
    actorType: "USER" | "SYSTEM" | "PARTNER" | "CUSTOMER" = "USER",
    reason?: string,
    correlationId?: string
  ): Promise<any> {
    const caseObj = await CaseModel.findById(caseId);
    if (!caseObj) {
      throw new Error(`Case ${caseId} not found`);
    }

    const currentStatus = caseObj.status;

    // Validate transition
    this.validateTransition(currentStatus, nextStatus);

    // Apply transition
    caseObj.status = nextStatus;
    if (nextStatus === "CLOSED" || nextStatus === "COMPLETED") {
      caseObj.closedAt = new Date();
    }
    await caseObj.save();

    // Log immutable status history
    await CaseStatusHistoryModel.create({
      caseId: caseObj._id,
      actorId: actorId ? new Types.ObjectId(actorId) : undefined,
      actorType,
      previousStatus: currentStatus,
      newStatus: nextStatus,
      reason,
      correlationId,
    });

    logger.info(`State Machine: Case ${caseId} transitioned from ${currentStatus} to ${nextStatus} by ${actorType}`);
    return caseObj;
  }
}
