import { Model } from "mongoose";
import { ServiceModel } from "./service.model";
import { ServicePricingModel } from "./pricing.model";
import { ServiceRevenueRuleModel } from "./revenue-rule.model";
import {
  IService,
  IServiceWithId,
  IServicePricing,
  IServiceRevenueRule,
} from "./service.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toServiceWithId(doc: any): IServiceWithId {
  return {
    id: String(doc._id),
    code: doc.code,
    name: doc.name,
    category: doc.category,
    description: doc.description,
    publicVisibility: doc.publicVisibility,
    clientAvailability: doc.clientAvailability,
    partnerAvailability: doc.partnerAvailability,
    status: doc.status,
    sortOrder: doc.sortOrder,
    documentRequirements: doc.documentRequirements,
    workflow: doc.workflow,
    slaDays: doc.slaDays,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class ServiceRepository {
  constructor(
    private readonly serviceModel: Model<IService> = ServiceModel,
    private readonly pricingModel: Model<IServicePricing> = ServicePricingModel,
    private readonly revenueRuleModel: Model<IServiceRevenueRule> = ServiceRevenueRuleModel
  ) {}

  // Service Core Methods
  public async findAll(): Promise<IServiceWithId[]> {
    const docs = await this.serviceModel.find().sort({ sortOrder: 1 }).lean();
    return docs.map(toServiceWithId);
  }

  public async findById(id: string): Promise<IServiceWithId | null> {
    const doc = await this.serviceModel.findById(id).lean();
    return doc ? toServiceWithId(doc) : null;
  }

  public async findByCode(code: string): Promise<IServiceWithId | null> {
    const doc = await this.serviceModel.findOne({ code }).lean();
    return doc ? toServiceWithId(doc) : null;
  }

  public async create(data: IService): Promise<IServiceWithId> {
    const doc = await this.serviceModel.create(data);
    return toServiceWithId(doc);
  }

  public async update(id: string, data: Partial<IService>): Promise<IServiceWithId | null> {
    const doc = await this.serviceModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? toServiceWithId(doc) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.serviceModel.findByIdAndDelete(id);
    return result !== null;
  }

  // Pricing Methods
  public async getPricing(serviceId: string): Promise<IServicePricing[]> {
    return this.pricingModel.find({ serviceId }).sort({ version: -1 }).lean();
  }

  public async createPricing(data: IServicePricing): Promise<IServicePricing> {
    return this.pricingModel.create(data);
  }

  // Revenue Rule Methods
  public async getRevenueRules(serviceId: string): Promise<IServiceRevenueRule[]> {
    return this.revenueRuleModel.find({ serviceId }).sort({ version: -1 }).lean();
  }

  public async createRevenueRule(data: IServiceRevenueRule): Promise<IServiceRevenueRule> {
    return this.revenueRuleModel.create(data);
  }
}
