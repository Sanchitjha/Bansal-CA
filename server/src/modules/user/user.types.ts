export interface IUser {
  name: string;
  email: string;
}

export interface IUserWithId extends IUser {
  id: string;
}

export type CreateUserInput = IUser;
export type UpdateUserInput = Partial<IUser>;

export interface IUserRepository {
  findAll(): Promise<IUserWithId[]>;
  findById(id: string): Promise<IUserWithId | null>;
  create(data: CreateUserInput): Promise<IUserWithId>;
  update(id: string, data: UpdateUserInput): Promise<IUserWithId | null>;
  delete(id: string): Promise<boolean>;
}

export interface IUserService {
  getUsers(): Promise<IUserWithId[]>;
  getUserById(id: string): Promise<IUserWithId>;
  createUser(data: CreateUserInput): Promise<IUserWithId>;
  updateUser(id: string, data: UpdateUserInput): Promise<IUserWithId>;
  deleteUser(id: string): Promise<void>;
}
