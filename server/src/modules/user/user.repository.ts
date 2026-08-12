import { Model } from "mongoose";
import { UserModel } from "./user.model";
import {
  CreateUserInput,
  IUser,
  IUserRepository,
  IUserWithId,
  UpdateUserInput,
} from "./user.types";

function toUserWithId(doc: { _id: unknown; name: string; email: string }): IUserWithId {
  return { id: String(doc._id), name: doc.name, email: doc.email };
}

export class UserRepository implements IUserRepository {
  constructor(private readonly model: Model<IUser> = UserModel) {}

  public async findAll(): Promise<IUserWithId[]> {
    const docs = await this.model.find().lean();
    return docs.map(toUserWithId);
  }

  public async findById(id: string): Promise<IUserWithId | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? toUserWithId(doc) : null;
  }

  public async create(data: CreateUserInput): Promise<IUserWithId> {
    const doc = await this.model.create(data);
    return toUserWithId(doc);
  }

  public async update(id: string, data: UpdateUserInput): Promise<IUserWithId | null> {
    const doc = await this.model.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? toUserWithId(doc) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}
