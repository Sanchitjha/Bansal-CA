import { BadRequestException, NotFoundException } from "../../common/errors/http-exception";
import {
  CreateRoleInput,
  IRoleRepository,
  IRoleService,
  IRoleWithId,
  UpdateRoleInput,
} from "./role.types";

export class RoleService implements IRoleService {
  constructor(private readonly roleRepository: IRoleRepository) {}

  public async getRoles(): Promise<IRoleWithId[]> {
    return this.roleRepository.findAll();
  }

  public async getRoleById(id: string): Promise<IRoleWithId> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  public async getRoleByName(name: string): Promise<IRoleWithId> {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return role;
  }

  public async createRole(data: CreateRoleInput): Promise<IRoleWithId> {
    if (!data.name) {
      throw new BadRequestException("Role name is required");
    }
    const existing = await this.roleRepository.findByName(data.name);
    if (existing) {
      throw new BadRequestException(`Role with name ${data.name} already exists`);
    }
    return this.roleRepository.create(data);
  }

  public async updateRole(id: string, data: UpdateRoleInput): Promise<IRoleWithId> {
    const updated = await this.roleRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return updated;
  }

  public async deleteRole(id: string): Promise<void> {
    const deleted = await this.roleRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
  }
}
