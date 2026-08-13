import { Model } from "mongoose";
import { PartnerModel } from "./partner.model";
import { IPartner, IPartnerWithId } from "./partner.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPartnerWithId(doc: any): IPartnerWithId {
  return {
    id: String(doc._id),
    userId: String(doc.userId),
    partnerCode: doc.partnerCode,
    partnerType: doc.partnerType,
    legalName: doc.legalName,
    displayName: doc.displayName,
    contact: doc.contact,
    status: doc.status,
    kyc: doc.kyc,
    bankAccounts: doc.bankAccounts,
    onboarding: doc.onboarding,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class PartnerRepository {
  constructor(private readonly model: Model<IPartner> = PartnerModel) {}

  public async findAll(): Promise<IPartnerWithId[]> {
    const docs = await this.model.find().lean();
    return docs.map(toPartnerWithId);
  }

  public async findById(id: string): Promise<IPartnerWithId | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? toPartnerWithId(doc) : null;
  }

  public async findByPartnerCode(partnerCode: string): Promise<IPartnerWithId | null> {
    const doc = await this.model.findOne({ partnerCode }).lean();
    return doc ? toPartnerWithId(doc) : null;
  }

  public async findByUserId(userId: string): Promise<IPartnerWithId | null> {
    const doc = await this.model.findOne({ userId }).lean();
    return doc ? toPartnerWithId(doc) : null;
  }

  public async create(data: IPartner): Promise<IPartnerWithId> {
    const doc = await this.model.create(data);
    return toPartnerWithId(doc);
  }

  public async update(id: string, data: Partial<IPartner>): Promise<IPartnerWithId | null> {
    const doc = await this.model.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? toPartnerWithId(doc) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}
