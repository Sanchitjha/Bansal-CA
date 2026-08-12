import { Model } from "mongoose";
import { LeadModel } from "./lead.model";
import { ILead, ILeadWithId } from "./lead.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toLeadWithId(doc: any): ILeadWithId {
  return {
    id: String(doc._id),
    leadNumber: doc.leadNumber,
    source: doc.source,
    partnerId: doc.partnerId ? String(doc.partnerId) : null,
    clientId: doc.clientId ? String(doc.clientId) : null,
    contactSnapshot: doc.contactSnapshot,
    serviceId: String(doc.serviceId),
    status: doc.status,
    assignedTo: doc.assignedTo ? String(doc.assignedTo) : null,
    notes: doc.notes,
    convertedAt: doc.convertedAt,
    convertedCaseId: doc.convertedCaseId ? String(doc.convertedCaseId) : null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class LeadRepository {
  constructor(private readonly model: Model<ILead> = LeadModel) {}

  public async findAll(): Promise<ILeadWithId[]> {
    const docs = await this.model.find().lean();
    return docs.map(toLeadWithId);
  }

  public async findById(id: string): Promise<ILeadWithId | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? toLeadWithId(doc) : null;
  }

  public async findByLeadNumber(leadNumber: string): Promise<ILeadWithId | null> {
    const doc = await this.model.findOne({ leadNumber }).lean();
    return doc ? toLeadWithId(doc) : null;
  }

  public async create(data: ILead): Promise<ILeadWithId> {
    const doc = await this.model.create(data);
    return toLeadWithId(doc);
  }

  public async update(id: string, data: Partial<ILead>): Promise<ILeadWithId | null> {
    const doc = await this.model.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? toLeadWithId(doc) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}
