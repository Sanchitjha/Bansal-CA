import { Types } from "mongoose";
import { IClientWithId } from "../client/client.types";

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
  password?: string;
}

export interface IUserWithId extends Omit<IUser, "roleId"> {
  id: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserInput = Omit<IUser, "status"> & { status?: UserStatus };
export type UpdateUserInput = Partial<IUser>;

export interface SignupInput {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  legalName?: string;
  clientType?: "INDIVIDUAL" | "BUSINESS";
}

export interface LoginInput {
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: IUserWithId;
  client: IClientWithId;
}

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
  signup(data: SignupInput): Promise<AuthResponse>;
  login(data: LoginInput): Promise<AuthResponse>;
  adminLogin(data: LoginInput): Promise<{ user: IUserWithId }>;
}

