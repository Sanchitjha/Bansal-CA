import { NextFunction, Request, Response } from "express";
import { IRoleService } from "./role.types";

export class RoleController {
  constructor(private readonly roleService: IRoleService) {}

  public getRoles = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roles = await this.roleService.getRoles();
      res.status(200).json(roles);
    } catch (err) {
      next(err);
    }
  };

  public getRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = await this.roleService.getRoleById(req.params.id);
      res.status(200).json(role);
    } catch (err) {
      next(err);
    }
  };

  public createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = await this.roleService.createRole(req.body);
      res.status(201).json(role);
    } catch (err) {
      next(err);
    }
  };

  public updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = await this.roleService.updateRole(req.params.id, req.body);
      res.status(200).json(role);
    } catch (err) {
      next(err);
    }
  };

  public deleteRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.roleService.deleteRole(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
