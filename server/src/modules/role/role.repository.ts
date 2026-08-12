import { Model } from "mongoose";
import { RoleModel } from "./role.model";
import {
  CreateRoleInput,
  IRole,
  IRoleRepository,
  IRoleWithId,
  UpdateRoleInput,
} from "./role.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRoleWithId(doc: any): IRoleWithId {
  return {
    id: String(doc._id),
    name: doc.name,
    permissions: doc.permissions,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class RoleRepository implements IRoleRepository {
  constructor(private readonly model: Model<IRole> = RoleModel) {}

  public async findAll(): Promise<IRoleWithId[]> {
    const docs = await this.model.find().lean();
    return docs.map(toRoleWithId);
  }

  public async findById(id: string): Promise<IRoleWithId | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? toRoleWithId(doc) : null;
  }

  public async findByName(name: string): Promise<IRoleWithId | null> {
    const doc = await this.model.findOne({ name: name.toUpperCase() }).lean();
    return doc ? toRoleWithId(doc) : null;
  }

  public async create(data: CreateRoleInput): Promise<IRoleWithId> {
    const doc = await this.model.create({
      ...data,
      name: data.name.toUpperCase(),
    });
    return toRoleWithId(doc);
  }

  public async update(id: string, data: UpdateRoleInput): Promise<IRoleWithId | null> {
    const updateData = { ...data };
    if (updateData.name) {
      updateData.name = updateData.name.toUpperCase();
    }
    const doc = await this.model.findByIdAndUpdate(id, updateData, { new: true }).lean();
    return doc ? toRoleWithId(doc) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}
