export interface IRole {
  name: string; // e.g., "ADMIN", "CORE_TEAM", "CHANNEL_PARTNER", "CLIENT"
  permissions: string[]; // e.g., ["case.read", "case.process", "document.review"]
  description?: string;
}

export interface IRoleWithId extends IRole {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateRoleInput = IRole;
export type UpdateRoleInput = Partial<IRole>;

export interface IRoleRepository {
  findAll(): Promise<IRoleWithId[]>;
  findById(id: string): Promise<IRoleWithId | null>;
  findByName(name: string): Promise<IRoleWithId | null>;
  create(data: CreateRoleInput): Promise<IRoleWithId>;
  update(id: string, data: UpdateRoleInput): Promise<IRoleWithId | null>;
  delete(id: string): Promise<boolean>;
}

export interface IRoleService {
  getRoles(): Promise<IRoleWithId[]>;
  getRoleById(id: string): Promise<IRoleWithId>;
  getRoleByName(name: string): Promise<IRoleWithId>;
  createRole(data: CreateRoleInput): Promise<IRoleWithId>;
  updateRole(id: string, data: UpdateRoleInput): Promise<IRoleWithId>;
  deleteRole(id: string): Promise<void>;
}
