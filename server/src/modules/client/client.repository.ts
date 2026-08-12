import { Model } from "mongoose";
import { ClientModel } from "./client.model";
import { IClient, IClientWithId } from "./client.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toClientWithId(doc: any): IClientWithId {
  return {
    id: String(doc._id),
    userId: String(doc.userId),
    clientCode: doc.clientCode,
    clientType: doc.clientType,
    acquisitionSource: doc.acquisitionSource,
    partnerId: doc.partnerId ? String(doc.partnerId) : null,
    legalName: doc.legalName,
    contact: doc.contact,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class ClientRepository {
  constructor(private readonly model: Model<IClient> = ClientModel) {}

  public async findAll(): Promise<IClientWithId[]> {
    const docs = await this.model.find().lean();
    return docs.map(toClientWithId);
  }

  public async findById(id: string): Promise<IClientWithId | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? toClientWithId(doc) : null;
  }

  public async findByClientCode(clientCode: string): Promise<IClientWithId | null> {
    const doc = await this.model.findOne({ clientCode }).lean();
    return doc ? toClientWithId(doc) : null;
  }

  public async create(data: IClient): Promise<IClientWithId> {
    const doc = await this.model.create(data);
    return toClientWithId(doc);
  }

  public async update(id: string, data: Partial<IClient>): Promise<IClientWithId | null> {
    const doc = await this.model.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? toClientWithId(doc) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}
