export interface AuthTokenPayload {
  sub: string; // user id
  userId?: string;
  partnerId?: string;
  clientId?: string;
  email: string;
  roleId: string;
  roleName: string;
  permissions: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
    roleName: string;
    permissions: string[];
    partnerId?: string;
    clientId?: string;
  };
}

export interface IAuthService {
  login(input: LoginInput): Promise<LoginResult>;
  verifyToken(token: string): AuthTokenPayload;
  hashPassword(plain: string): Promise<string>;
}
