import { NextFunction, Request, Response } from "express";
import { ForbiddenException, UnauthorizedException } from "../errors/http-exception";
import { IAuthService } from "../../modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      tenantScope?: {
        partnerId?: string;
        clientId?: string;
        userId?: string;
        isSuperAdmin?: boolean;
      };
    }
  }
}

export class Authenticate {
  constructor(private readonly authService: IAuthService) {}

  public handle = (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith("Bearer ")) {
        throw new UnauthorizedException("Missing bearer token");
      }
      const token = header.slice(7).trim();
      if (!token) {
        throw new UnauthorizedException("Missing bearer token");
      }
      const decoded = this.authService.verifyToken(token);
      req.user = decoded;

      // Establish tenant scope for record-level authorization
      const isSuperAdmin = decoded.roleName === "ADMIN" || decoded.permissions?.includes("ALL");
      req.tenantScope = {
        partnerId: decoded.partnerId,
        clientId: decoded.clientId,
        userId: decoded.userId,
        isSuperAdmin,
      };

      next();
    } catch (err) {
      next(err);
    }
  };

  public authorizePermission = (...requiredPermissions: string[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          throw new UnauthorizedException("User unauthenticated");
        }
        const userPermissions: string[] = req.user.permissions || [];
        const isSuperAdmin = req.user.roleName === "ADMIN" || userPermissions.includes("ALL");

        if (isSuperAdmin) {
          return next();
        }

        const hasPermission = requiredPermissions.some((perm) => userPermissions.includes(perm));
        if (!hasPermission) {
          throw new ForbiddenException(`Insufficient permission. Requires one of: [${requiredPermissions.join(", ")}]`);
        }

        next();
      } catch (err) {
        next(err);
      }
    };
  };
}
