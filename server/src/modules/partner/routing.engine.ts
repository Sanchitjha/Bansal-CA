import { Types } from "mongoose";
import { CaseModel } from "../case/case.model";
import { CaseAssignmentHistoryModel } from "../case/case-history.model";
import { PartnerModel } from "./partner.model";
import { RoutingRuleModel, IRoutingRule } from "./routing-rule.model";
import { logger } from "../../config/logger";

export interface IRoutingParams {
  caseId: string;
  serviceId: string;
  clientState?: string;
  clientCity?: string;
  clientPincode?: string;
  assignedByUserId?: string;
}

export class RoutingEngine {
  public async routeRequest(params: IRoutingParams): Promise<{ partnerId: string | null; status: "ASSIGNED" | "EXCEPTION" }> {
    const { caseId, serviceId, clientState, clientCity, clientPincode, assignedByUserId } = params;

    // 1. Fetch case
    const caseObj = await CaseModel.findById(caseId);
    if (!caseObj) {
      throw new Error(`Case ${caseId} not found for routing.`);
    }

    // 2. Fetch routing rules for service, sorted by priority (lowest number = highest priority)
    const rules = await RoutingRuleModel.find({ serviceId, isActive: true }).sort({ priority: 1 });

    let selectedPartnerId: Types.ObjectId | null = null;

    for (const rule of rules) {
      // Filter partner pool from rule, or all active partners if pool is empty
      let query: any = { status: "ACTIVE" };
      if (rule.partnerPool && rule.partnerPool.length > 0) {
        query._id = { $in: rule.partnerPool };
      }

      const activePartners = await PartnerModel.find(query);

      // Geography filtering
      const eligiblePartners = activePartners.filter((partner) => {
        if (rule.allowedStates && rule.allowedStates.length > 0 && clientState) {
          if (!rule.allowedStates.includes(clientState)) return false;
        }
        if (rule.allowedCities && rule.allowedCities.length > 0 && clientCity) {
          if (!rule.allowedCities.includes(clientCity)) return false;
        }
        if (rule.allowedPincodes && rule.allowedPincodes.length > 0 && clientPincode) {
          if (!rule.allowedPincodes.includes(clientPincode)) return false;
        }
        return true;
      });

      if (eligiblePartners.length === 0) {
        continue; // Try next routing rule
      }

      // Workload capacity check
      const maxWorkload = rule.maxActiveWorkloadPerPartner || 50;
      const partnerWorkloads = await Promise.all(
        eligiblePartners.map(async (partner) => {
          const count = await CaseModel.countDocuments({
            partnerId: partner._id,
            status: { $in: ["SUBMITTED", "ASSIGNED", "IN_REVIEW", "PROCESSING", "IN_PROCESS", "OPEN"] },
          });
          return { partner, activeCount: count };
        })
      );

      const underCapacity = partnerWorkloads.filter((p) => p.activeCount < maxWorkload);
      if (underCapacity.length === 0) {
        continue;
      }

      // Strategy selection (Least-Loaded by default)
      if (rule.strategy === "LEAST_LOADED") {
        underCapacity.sort((a, b) => a.activeCount - b.activeCount);
        selectedPartnerId = underCapacity[0].partner._id as Types.ObjectId;
      } else {
        // Round robin / default
        const randomIndex = Math.floor(Math.random() * underCapacity.length);
        selectedPartnerId = underCapacity[randomIndex].partner._id as Types.ObjectId;
      }

      if (selectedPartnerId) {
        break; // Match found!
      }
    }

    // Fallback: If no rule matched, check if there's any active partner under default capacity
    if (!selectedPartnerId) {
      const anyPartner = await PartnerModel.findOne({ status: "ACTIVE" });
      if (anyPartner) {
        selectedPartnerId = anyPartner._id as Types.ObjectId;
      }
    }

    // Execute Assignment or Exception Transition
    if (selectedPartnerId) {
      const prevPartnerId = caseObj.partnerId;
      caseObj.partnerId = selectedPartnerId;
      caseObj.status = "ASSIGNED";
      await caseObj.save();

      // Record assignment history
      await CaseAssignmentHistoryModel.create({
        caseId: caseObj._id,
        assignedBy: assignedByUserId ? new Types.ObjectId(assignedByUserId) : undefined,
        previousPartnerId: prevPartnerId || undefined,
        newPartnerId: selectedPartnerId,
        reason: "AUTOMATIC_ROUTING_ENGINE",
      });

      logger.info(`Routing Engine: Case ${caseId} assigned to Partner ${selectedPartnerId}`);
      return { partnerId: selectedPartnerId.toString(), status: "ASSIGNED" };
    } else {
      // Unroutable -> Flag for Admin Exception Queue
      caseObj.status = "EXCEPTION";
      caseObj.notes = (caseObj.notes || "") + " [Routing Exception: No eligible active partner found]";
      await caseObj.save();

      logger.warn(`Routing Engine: Case ${caseId} placed in EXCEPTION queue (No eligible partner)`);
      return { partnerId: null, status: "EXCEPTION" };
    }
  }
}
