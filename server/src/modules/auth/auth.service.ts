import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import {
  BadRequestException,
  UnauthorizedException,
} from "../../common/errors/http-exception";
import { env } from "../../config/env";
import { IRoleRepository } from "../role/role.types";
import { IUserRepository } from "../user/user.types";
import {
  AuthTokenPayload,
  IAuthService,
  LoginInput,
  LoginResult,
} from "./auth.types";

/** Sign a JWT for an authenticated user. Shared by AuthService and UserService. */
export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as SignOptions);
}

/** Verify a JWT and return its payload, or throw UnauthorizedException. */
export function verifyAuthToken(token: string): AuthTokenPayload {
  try {
    return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
  } catch {
    throw new UnauthorizedException("Invalid or expired token");
  }
}

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository
  ) {}

  public async login({ email, password }: LoginInput): Promise<LoginResult> {
    if (!email || !password) {
      throw new BadRequestException("email and password are required");
    }

    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }
    if (user.status !== "ACTIVE") {
      throw new UnauthorizedException(`Account is ${user.status.toLowerCase()}`);
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const role = await this.roleRepository.findById(user.roleId);
    if (!role) {
      throw new UnauthorizedException("Assigned role no longer exists");
    }

    const payload: AuthTokenPayload = {
      sub: user.id,
      email: user.email,
      roleId: role.id,
      roleName: role.name,
      permissions: role.permissions ?? [],
    };
    const token = signAuthToken(payload);

    await this.userRepository.updateLastLogin(user.id);

    return {
      token,
      expiresIn: env.jwtExpiresIn,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: role.id,
        roleName: role.name,
        permissions: role.permissions ?? [],
      },
    };
  }

  public verifyToken(token: string): AuthTokenPayload {
    return verifyAuthToken(token);
  }

  public async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, env.bcryptSaltRounds);
  }
}
