import { BadRequestException, NotFoundException } from "../../common/errors/http-exception";
import { LeadRepository } from "./lead.repository";
import { ILead, ILeadWithId } from "./lead.types";

export class LeadService {
  constructor(private readonly leadRepository: LeadRepository) {}

  public async getLeads(): Promise<ILeadWithId[]> {
    return this.leadRepository.findAll();
  }

  public async getLeadById(id: string): Promise<ILeadWithId> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new NotFoundException(`Lead with id ${id} not found`);
    }
    return lead;
  }

  public async createLead(data: ILead): Promise<ILeadWithId> {
    if (!data.leadNumber || !data.source || !data.contactSnapshot || !data.serviceId) {
      throw new BadRequestException("leadNumber, source, contactSnapshot, and serviceId are required");
    }
    const existing = await this.leadRepository.findByLeadNumber(data.leadNumber);
    if (existing) {
      throw new BadRequestException(`Lead with number ${data.leadNumber} already exists`);
    }
    return this.leadRepository.create(data);
  }

  public async updateLead(id: string, data: Partial<ILead>): Promise<ILeadWithId> {
    const updated = await this.leadRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Lead with id ${id} not found`);
    }
    return updated;
  }

  public async deleteLead(id: string): Promise<void> {
    const deleted = await this.leadRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Lead with id ${id} not found`);
    }
  }
}
