import { Types } from "mongoose";

export type UserStatus = "INVITED" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

export interface IUser {
  externalAuthId: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  roleId: Types.ObjectId; // References Role
  status: UserStatus;
  lastLoginAt?: Date;
}

export interface IUserWithId extends Omit<IUser, "roleId"> {
  id: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserInput = Omit<IUser, "status"> & { status?: UserStatus };
export type UpdateUserInput = Partial<IUser>;

export interface IUserRepository {
  findAll(): Promise<IUserWithId[]>;
  findById(id: string): Promise<IUserWithId | null>;
  findByExternalAuthId(externalAuthId: string): Promise<IUserWithId | null>;
  create(data: CreateUserInput): Promise<IUserWithId>;
  update(id: string, data: UpdateUserInput): Promise<IUserWithId | null>;
  delete(id: string): Promise<boolean>;
}

export interface IUserService {
  getUsers(): Promise<IUserWithId[]>;
  getUserById(id: string): Promise<IUserWithId>;
  getUserByExternalId(externalId: string): Promise<IUserWithId>;
  createUser(data: CreateUserInput): Promise<IUserWithId>;
  updateUser(id: string, data: UpdateUserInput): Promise<IUserWithId>;
  deleteUser(id: string): Promise<void>;
}
