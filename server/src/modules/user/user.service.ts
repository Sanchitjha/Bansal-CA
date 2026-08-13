import { BadRequestException, NotFoundException } from "../../common/errors/http-exception";
import { UserModel } from "./user.model";
import { RoleModel } from "../role/role.model";
import { ClientModel } from "../client/client.model";
import { hashPassword } from "./user.utils";
import {
  CreateUserInput,
  IUserRepository,
  IUserService,
  IUserWithId,
  UpdateUserInput,
  SignupInput,
  LoginInput,
  AuthResponse,
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

  public async getUserByExternalId(externalId: string): Promise<IUserWithId> {
    const user = await this.userRepository.findByExternalAuthId(externalId);
    if (!user) {
      throw new NotFoundException(`User with external ID ${externalId} not found`);
    }
    return user;
  }

  public async createUser(data: CreateUserInput): Promise<IUserWithId> {
    if (!data.externalAuthId || !data.email || !data.firstName || !data.lastName || !data.roleId) {
      throw new BadRequestException("externalAuthId, email, firstName, lastName, and roleId are required");
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

  public async signup(data: SignupInput): Promise<AuthResponse> {
    const { email, password, firstName, lastName, phone, legalName, clientType } = data;
    if (!email || !password || !firstName || !lastName) {
      throw new BadRequestException("Email, password, firstName, and lastName are required");
    }

    const existingEmail = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      throw new BadRequestException("User with this email already exists");
    }

    let clientRole = await RoleModel.findOne({ name: "CLIENT" });
    if (!clientRole) {
      clientRole = await RoleModel.create({
        name: "CLIENT",
        description: "Standard client portal role",
        permissions: [],
      });
    }

    const hashedPassword = hashPassword(password);

    const userDoc = await UserModel.create({
      email: email.toLowerCase(),
      phone: phone || "",
      firstName,
      lastName,
      password: hashedPassword,
      roleId: clientRole._id,
      status: "ACTIVE",
      externalAuthId: email.toLowerCase(),
    });

    const clientCode = `CL-${Math.floor(100000 + Math.random() * 900000)}`;

    const clientDoc = await ClientModel.create({
      userId: userDoc._id,
      clientCode,
      clientType: clientType || "INDIVIDUAL",
      acquisitionSource: "SELF",
      legalName: legalName || `${firstName} ${lastName}`,
      contact: {
        email: email.toLowerCase(),
        phone: phone || "",
      },
      status: "ACTIVE",
    });

    const userResponse = {
      id: String(userDoc._id),
      email: userDoc.email,
      phone: userDoc.phone,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      roleId: String(userDoc.roleId),
      status: userDoc.status,
      externalAuthId: userDoc.externalAuthId,
      lastLoginAt: userDoc.lastLoginAt,
      createdAt: (userDoc as any).createdAt,
      updatedAt: (userDoc as any).updatedAt,
    };

    const clientResponse = {
      id: String(clientDoc._id),
      userId: String(clientDoc.userId),
      clientCode: clientDoc.clientCode,
      clientType: clientDoc.clientType,
      acquisitionSource: clientDoc.acquisitionSource,
      partnerId: null,
      legalName: clientDoc.legalName,
      contact: clientDoc.contact,
      status: clientDoc.status,
      createdAt: (clientDoc as any).createdAt,
      updatedAt: (clientDoc as any).updatedAt,
    };

    return {
      user: userResponse,
      client: clientResponse,
    };
  }

  public async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data;
    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const userDoc = await UserModel.findOne({ email: email.toLowerCase() }).select("+password");
    if (!userDoc || !userDoc.password) {
      throw new BadRequestException("Invalid email or password");
    }

    const hashedPassword = hashPassword(password);
    if (userDoc.password !== hashedPassword) {
      throw new BadRequestException("Invalid email or password");
    }

    const clientDoc = await ClientModel.findOne({ userId: userDoc._id });
    if (!clientDoc) {
      throw new NotFoundException("Client profile not found for this user");
    }

    userDoc.lastLoginAt = new Date();
    await userDoc.save();

    const userResponse = {
      id: String(userDoc._id),
      email: userDoc.email,
      phone: userDoc.phone,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      roleId: String(userDoc.roleId),
      status: userDoc.status,
      externalAuthId: userDoc.externalAuthId,
      lastLoginAt: userDoc.lastLoginAt,
      createdAt: (userDoc as any).createdAt,
      updatedAt: (userDoc as any).updatedAt,
    };

    const clientResponse = {
      id: String(clientDoc._id),
      userId: String(clientDoc.userId),
      clientCode: clientDoc.clientCode,
      clientType: clientDoc.clientType,
      acquisitionSource: clientDoc.acquisitionSource,
      partnerId: clientDoc.partnerId ? String(clientDoc.partnerId) : null,
      legalName: clientDoc.legalName,
      contact: clientDoc.contact,
      status: clientDoc.status,
      createdAt: (clientDoc as any).createdAt,
      updatedAt: (clientDoc as any).updatedAt,
    };

    return {
      user: userResponse,
      client: clientResponse,
    };
  }

  public async adminLogin(data: LoginInput): Promise<{ user: IUserWithId }> {
    const { email, password } = data;
    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const userDoc = await UserModel.findOne({ email: email.toLowerCase() }).select("+password").populate("roleId");
    if (!userDoc || !userDoc.password) {
      throw new BadRequestException("Invalid email or password");
    }

    const hashedPassword = hashPassword(password);
    if (userDoc.password !== hashedPassword) {
      throw new BadRequestException("Invalid email or password");
    }

    const roleDoc: any = userDoc.roleId;
    if (!roleDoc || roleDoc.name === "CLIENT") {
      throw new BadRequestException("Unauthorized access. Admin portal is restricted.");
    }

    userDoc.lastLoginAt = new Date();
    await userDoc.save();

    const userResponse = {
      id: String(userDoc._id),
      email: userDoc.email,
      phone: userDoc.phone,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      roleId: String(roleDoc._id),
      status: userDoc.status,
      externalAuthId: userDoc.externalAuthId,
      lastLoginAt: userDoc.lastLoginAt,
      createdAt: (userDoc as any).createdAt,
      updatedAt: (userDoc as any).updatedAt,
    };

    return {
      user: userResponse,
    };
  }
}

