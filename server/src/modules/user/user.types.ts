import { Types } from "mongoose";
import { IClientWithId } from "../client/client.types";
import { IPartnerWithId } from "../partner/partner.types";

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
  password?: string;
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

export interface SignupInput {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  legalName?: string;
  clientType?: "INDIVIDUAL" | "BUSINESS";
}

export interface PartnerSignupInput {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  legalName?: string;
  displayName?: string;
  partnerType?: "INDIVIDUAL" | "AGENCY";
  pan: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface LoginInput {
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: IUserWithId;
  client: IClientWithId;
  token: string;
  expiresIn: string;
}

export interface PartnerAuthResponse {
  user: IUserWithId;
  partner: IPartnerWithId;
  token: string;
  expiresIn: string;
}

export interface AdminAuthResponse {
  user: IUserWithId;
  token: string;
  expiresIn: string;
}

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
  signup(data: SignupInput): Promise<AuthResponse>;
  login(data: LoginInput): Promise<AuthResponse>;
  adminLogin(data: LoginInput): Promise<AdminAuthResponse>;
  partnerSignup(data: PartnerSignupInput): Promise<PartnerAuthResponse>;
  partnerLogin(data: LoginInput): Promise<PartnerAuthResponse>;
}

