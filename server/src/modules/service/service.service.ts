import { Types } from "mongoose";
import { BadRequestException, NotFoundException } from "../../common/errors/http-exception";
import { ServiceRepository } from "./service.repository";
import { IService, IServiceWithId, IServicePricing, IServiceRevenueRule } from "./service.types";

export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  public async getServices(): Promise<IServiceWithId[]> {
    return this.serviceRepository.findAll();
  }

  public async getServiceById(id: string): Promise<IServiceWithId> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    return service;
  }

  public async getServiceByCode(code: string): Promise<IServiceWithId> {
    const service = await this.serviceRepository.findByCode(code);
    if (!service) {
      throw new NotFoundException(`Service with code ${code} not found`);
    }
    return service;
  }

  public async createService(data: IService): Promise<IServiceWithId> {
    if (!data.code || !data.name || !data.category) {
      throw new BadRequestException("code, name, and category are required");
    }
    const existing = await this.serviceRepository.findByCode(data.code);
    if (existing) {
      throw new BadRequestException(`Service with code ${data.code} already exists`);
    }
    return this.serviceRepository.create(data);
  }

  public async updateService(id: string, data: Partial<IService>): Promise<IServiceWithId> {
    const updated = await this.serviceRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    return updated;
  }

  public async deleteService(id: string): Promise<void> {
    const deleted = await this.serviceRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
  }

  // Pricing & Revenue Rules
  public async getPricing(serviceId: string): Promise<IServicePricing[]> {
    await this.getServiceById(serviceId);
    return this.serviceRepository.getPricing(serviceId);
  }

  public async addPricing(serviceId: string, pricingData: Omit<IServicePricing, "serviceId">): Promise<IServicePricing> {
    await this.getServiceById(serviceId);
    return this.serviceRepository.createPricing({
      ...pricingData,
      serviceId: new Types.ObjectId(serviceId),
    });
  }

  public async getRevenueRules(serviceId: string): Promise<IServiceRevenueRule[]> {
    await this.getServiceById(serviceId);
    return this.serviceRepository.getRevenueRules(serviceId);
  }

  public async addRevenueRule(serviceId: string, ruleData: Omit<IServiceRevenueRule, "serviceId">): Promise<IServiceRevenueRule> {
    await this.getServiceById(serviceId);
    return this.serviceRepository.createRevenueRule({
      ...ruleData,
      serviceId: new Types.ObjectId(serviceId),
    });
  }
}
