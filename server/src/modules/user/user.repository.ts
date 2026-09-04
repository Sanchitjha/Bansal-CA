import { Model } from "mongoose";
import { UserModel } from "./user.model";
import {
  CreateUserInput,
  IUser,
  IUserRepository,
  IUserWithId,
  IUserWithPassword,
  UpdateUserInput,
} from "./user.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toUserWithId(doc: any): IUserWithId {
  return {
    id: String(doc._id),
    externalAuthId: doc.externalAuthId,
    email: doc.email,
    phone: doc.phone,
    firstName: doc.firstName,
    lastName: doc.lastName,
    roleId: String(doc.roleId),
    status: doc.status,
    lastLoginAt: doc.lastLoginAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
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

  public async findByEmail(email: string): Promise<IUserWithId | null> {
    const doc = await this.model.findOne({ email: email.toLowerCase() }).lean();
    return doc ? toUserWithId(doc) : null;
  }

  public async findByEmailWithPassword(email: string): Promise<IUserWithPassword | null> {
    const doc = await this.model
      .findOne({ email: email.toLowerCase() })
      .select("+passwordHash")
      .lean();
    if (!doc || !doc.passwordHash) return null;
    return { ...toUserWithId(doc), passwordHash: doc.passwordHash };
  }

  public async findByExternalAuthId(externalAuthId: string): Promise<IUserWithId | null> {
    const doc = await this.model.findOne({ externalAuthId }).lean();
    return doc ? toUserWithId(doc) : null;
  }

  public async create(
    data: CreateUserInput & { passwordHash?: string }
  ): Promise<IUserWithId> {
    const { password: _password, ...rest } = data;
    void _password;
    const doc = await this.model.create({
      ...rest,
      status: data.status || "INVITED",
    });
    return toUserWithId(doc);
  }

  public async update(
    id: string,
    data: UpdateUserInput & { passwordHash?: string }
  ): Promise<IUserWithId | null> {
    const { password: _password, ...rest } = data;
    void _password;
    const doc = await this.model.findByIdAndUpdate(id, rest, { new: true }).lean();
    return doc ? toUserWithId(doc) : null;
  }

  public async updateLastLogin(id: string): Promise<void> {
    await this.model.updateOne({ _id: id }, { $set: { lastLoginAt: new Date() } });
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}
