import mongoose, { Types } from "mongoose";
import { CommissionPlanModel, ICommissionPlan, ICommissionSlab } from "./commission-plan.model";
import { RevenueLedgerEntryModel } from "./revenue-ledger.model";
import { PartnerModel } from "../partner/partner.model";
import { logger } from "../../config/logger";

export interface ICalculateCommissionParams {
  partnerId: string;
  caseId: string;
  paymentId?: string;
  grossAmountMinor: number;
  serviceId?: string;
}

export class CommissionEngine {
  public async calculateAndRecordCommission(params: ICalculateCommissionParams): Promise<any> {
    const { partnerId, caseId, paymentId, grossAmountMinor, serviceId } = params;

    const partner = await PartnerModel.findById(partnerId);
    if (!partner) {
      throw new Error(`Partner ${partnerId} not found for commission calculation.`);
    }

    // 1. Find matching commission plan (Specific partner+service > Service default > Global default)
    let plan = await CommissionPlanModel.findOne({
      partnerId: new Types.ObjectId(partnerId),
      serviceId: serviceId ? new Types.ObjectId(serviceId) : undefined,
      isActive: true,
    });

    if (!plan && serviceId) {
      plan = await CommissionPlanModel.findOne({
        serviceId: new Types.ObjectId(serviceId),
        isActive: true,
      });
    }

    // Default rate values if no explicit plan exists
    let percentageRate = partner.revenueSharePct || 15;
    let fixedBonusMinor = 0;
    let tdsPercentage = partner.tdsPct || 10;
    let ruleType: "PERCENTAGE" | "FIXED_AMOUNT" | "HYBRID" | "SLAB" = "PERCENTAGE";

    if (plan) {
      ruleType = plan.ruleType;
      tdsPercentage = plan.tdsPercentageRate;

      if (plan.ruleType === "SLAB" && plan.slabs && plan.slabs.length > 0) {
        // Find matching slab based on gross revenue
        const matchingSlab = plan.slabs.find(
          (slab: ICommissionSlab) =>
            grossAmountMinor >= slab.minRevenueMinor &&
            (!slab.maxRevenueMinor || grossAmountMinor <= slab.maxRevenueMinor)
        );

        if (matchingSlab) {
          percentageRate = matchingSlab.percentageRate;
          fixedBonusMinor = matchingSlab.fixedBonusMinor;
        } else {
          percentageRate = plan.defaultPercentageRate;
          fixedBonusMinor = plan.defaultFixedAmountMinor;
        }
      } else if (plan.ruleType === "FIXED_AMOUNT") {
        percentageRate = 0;
        fixedBonusMinor = plan.defaultFixedAmountMinor;
      } else if (plan.ruleType === "HYBRID") {
        percentageRate = plan.defaultPercentageRate;
        fixedBonusMinor = plan.defaultFixedAmountMinor;
      } else {
        percentageRate = plan.defaultPercentageRate;
      }
    }

    // 2. Perform Commission Calculation
    const calculatedShare = Math.floor((grossAmountMinor * percentageRate) / 100) + fixedBonusMinor;
    const tdsAmount = Math.floor((calculatedShare * tdsPercentage) / 100);
    const netPayable = calculatedShare - tdsAmount;

    // 3. Create Immutable Ledger Entry
    const entry = await RevenueLedgerEntryModel.create({
      partnerId: new Types.ObjectId(partnerId),
      caseId: new Types.ObjectId(caseId),
      paymentId: paymentId ? new Types.ObjectId(paymentId) : undefined,
      entryType: "EARNING",
      grossAmountMinor,
      eligibleRevenueMinor: grossAmountMinor,
      partnerShareMinor: calculatedShare,
      tdsAmountMinor: tdsAmount,
      otherDeductionMinor: 0,
      netPayableMinor: netPayable,
      ruleSnapshot: {
        ruleType,
        value: percentageRate,
        tdsPercentage,
      },
      status: "PENDING",
    });

    logger.info(`Commission Engine: Recorded ledger entry ${entry._id} for Partner ${partnerId} (Net: ₹${netPayable / 100})`);
    return entry;
  }

  public async reverseCommission(caseId: string, reason: string): Promise<any> {
    const originalEntries = await RevenueLedgerEntryModel.find({
      caseId: new Types.ObjectId(caseId),
      entryType: "EARNING",
      status: { $in: ["PENDING", "APPROVED", "PAYABLE"] },
    });

    const reversalEntries = [];

    for (const original of originalEntries) {
      // Mark original as REVERSED
      original.status = "REVERSED";
      original.adjustmentReason = reason;
      await original.save();

      // Create offsetting reversal ledger entry
      const reversal = await RevenueLedgerEntryModel.create({
        partnerId: original.partnerId,
        caseId: original.caseId,
        paymentId: original.paymentId,
        entryType: "REFUND_REVERSAL",
        grossAmountMinor: -original.grossAmountMinor,
        eligibleRevenueMinor: -original.eligibleRevenueMinor,
        partnerShareMinor: -original.partnerShareMinor,
        tdsAmountMinor: -original.tdsAmountMinor,
        otherDeductionMinor: 0,
        netPayableMinor: -original.netPayableMinor,
        ruleSnapshot: original.ruleSnapshot,
        status: "REVERSED",
        adjustmentReason: reason,
      });

      reversalEntries.push(reversal);
    }

    logger.info(`Commission Engine: Created ${reversalEntries.length} reversal ledger entries for Case ${caseId}`);
    return reversalEntries;
  }
}
