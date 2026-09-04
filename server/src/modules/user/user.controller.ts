import { NextFunction, Request, Response } from "express";
import { IUserService } from "./user.types";

export class UserController {
  constructor(private readonly userService: IUserService) {}

  public getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getUsers();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  public getUserByExternalId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.getUserByExternalId(req.params.externalId);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  public signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.userService.signup(req.body);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.userService.login(req.body);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  public adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.userService.adminLogin(req.body);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  public partnerSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.userService.partnerSignup(req.body);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  public partnerLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.userService.partnerLogin(req.body);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
