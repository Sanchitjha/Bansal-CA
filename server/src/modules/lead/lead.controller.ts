import { NextFunction, Request, Response } from "express";
import { LeadService } from "./lead.service";

export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  public getLeads = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const leads = await this.leadService.getLeads();
      res.status(200).json(leads);
    } catch (err) {
      next(err);
    }
  };

  public getLeadById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lead = await this.leadService.getLeadById(req.params.id);
      res.status(200).json(lead);
    } catch (err) {
      next(err);
    }
  };

  public createLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lead = await this.leadService.createLead(req.body);
      res.status(201).json(lead);
    } catch (err) {
      next(err);
    }
  };

  public updateLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lead = await this.leadService.updateLead(req.params.id, req.body);
      res.status(200).json(lead);
    } catch (err) {
      next(err);
    }
  };

  public deleteLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.leadService.deleteLead(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
