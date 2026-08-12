import { NextFunction, Request, Response } from "express";
import { ClientService } from "./client.service";

export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  public getClients = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clients = await this.clientService.getClients();
      res.status(200).json(clients);
    } catch (err) {
      next(err);
    }
  };

  public getClientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const client = await this.clientService.getClientById(req.params.id);
      res.status(200).json(client);
    } catch (err) {
      next(err);
    }
  };

  public createClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const client = await this.clientService.createClient(req.body);
      res.status(201).json(client);
    } catch (err) {
      next(err);
    }
  };

  public updateClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const client = await this.clientService.updateClient(req.params.id, req.body);
      res.status(200).json(client);
    } catch (err) {
      next(err);
    }
  };

  public deleteClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.clientService.deleteClient(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
