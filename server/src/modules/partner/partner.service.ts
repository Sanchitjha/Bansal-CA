import { BadRequestException, NotFoundException } from "../../common/errors/http-exception";
import { PartnerRepository } from "./partner.repository";
import { IPartner, IPartnerWithId } from "./partner.types";

export class PartnerService {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  public async getPartners(): Promise<IPartnerWithId[]> {
    return this.partnerRepository.findAll();
  }

  public async getPartnerById(id: string): Promise<IPartnerWithId> {
    const partner = await this.partnerRepository.findById(id);
    if (!partner) {
      throw new NotFoundException(`Partner with id ${id} not found`);
    }
    return partner;
  }

  public async getPartnerByCode(code: string): Promise<IPartnerWithId> {
    const partner = await this.partnerRepository.findByPartnerCode(code);
    if (!partner) {
      throw new NotFoundException(`Partner with code ${code} not found`);
    }
    return partner;
  }

  public async createPartner(data: IPartner): Promise<IPartnerWithId> {
    if (!data.userId || !data.partnerCode || !data.legalName || !data.contact) {
      throw new BadRequestException("userId, partnerCode, legalName, and contact details are required");
    }
    const existing = await this.partnerRepository.findByPartnerCode(data.partnerCode);
    if (existing) {
      throw new BadRequestException(`Partner with code ${data.partnerCode} already exists`);
    }
    return this.partnerRepository.create(data);
  }

  public async updatePartner(id: string, data: Partial<IPartner>): Promise<IPartnerWithId> {
    const updated = await this.partnerRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Partner with id ${id} not found`);
    }
    return updated;
  }

  public async deletePartner(id: string): Promise<void> {
    const deleted = await this.partnerRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Partner with id ${id} not found`);
    }
  }
}
