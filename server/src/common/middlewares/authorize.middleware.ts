import { NextFunction, Request, RequestHandler, Response } from "express";
import { ForbiddenException, UnauthorizedException } from "../errors/http-exception";

/**
 * Guards a route by requiring the authenticated user to hold every listed permission.
 * The ADMIN role bypasses the check (wildcard through role name).
 * Pair with `Authenticate.handle` earlier in the chain.
 */
export function authorize(...required: string[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedException());
    }
    if (req.user.roleName === "ADMIN") {
      return next();
    }
    const held = new Set(req.user.permissions ?? []);
    const missing = required.filter((p) => !held.has(p));
    if (missing.length > 0) {
      return next(
        new ForbiddenException(`Missing required permission(s): ${missing.join(", ")}`)
      );
    }
    next();
  };
}
