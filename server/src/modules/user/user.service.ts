import { BadRequestException, NotFoundException } from "../../common/errors/http-exception";
import {
  CreateUserInput,
  IUserRepository,
  IUserService,
  IUserWithId,
  UpdateUserInput,
} from "./user.types";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  public async getUsers(): Promise<IUserWithId[]> {
    return this.userRepository.findAll();
  }

  public async getUserById(id: string): Promise<IUserWithId> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  public async createUser(data: CreateUserInput): Promise<IUserWithId> {
    if (!data.name || !data.email) {
      throw new BadRequestException("name and email are required");
    }
    return this.userRepository.create(data);
  }

  public async updateUser(id: string, data: UpdateUserInput): Promise<IUserWithId> {
    const updated = await this.userRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updated;
  }

  public async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
