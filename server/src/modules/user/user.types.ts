import { Types } from "mongoose";

export type UserStatus = "INVITED" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

export interface IUser {
  externalAuthId: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  passwordHash?: string;
  roleId: Types.ObjectId; // References Role
  status: UserStatus;
  lastLoginAt?: Date;
}

export interface IUserWithId extends Omit<IUser, "roleId" | "passwordHash"> {
  id: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Internal-only shape that still carries the hash — never expose from HTTP.
export interface IUserWithPassword extends IUserWithId {
  passwordHash: string;
}

export type CreateUserInput = Omit<IUser, "status" | "passwordHash"> & {
  status?: UserStatus;
  password?: string;
};
export type UpdateUserInput = Partial<Omit<IUser, "passwordHash">> & { password?: string };

export interface IUserRepository {
  findAll(): Promise<IUserWithId[]>;
  findById(id: string): Promise<IUserWithId | null>;
  findByEmail(email: string): Promise<IUserWithId | null>;
  findByEmailWithPassword(email: string): Promise<IUserWithPassword | null>;
  findByExternalAuthId(externalAuthId: string): Promise<IUserWithId | null>;
  create(data: CreateUserInput & { passwordHash?: string }): Promise<IUserWithId>;
  update(id: string, data: UpdateUserInput & { passwordHash?: string }): Promise<IUserWithId | null>;
  updateLastLogin(id: string): Promise<void>;
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
