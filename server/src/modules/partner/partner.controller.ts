import { NextFunction, Request, Response } from "express";
import { PartnerService } from "./partner.service";

export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  // Routing Rules
  public createRoutingRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rule = await this.partnerService.createRoutingRule(req.body);
      res.status(201).json(rule);
    } catch (err) {
      next(err);
    }
  };

  public getRoutingRules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { serviceId } = req.query as { serviceId?: string };
      const rules = await this.partnerService.getRoutingRules(serviceId);
      res.status(200).json(rules);
    } catch (err) {
      next(err);
    }
  };

  // Partners
  public getPartners = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const partners = await this.partnerService.getPartners();
      res.status(200).json(partners);
    } catch (err) {
      next(err);
    }
  };

  public getPartnerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const partner = await this.partnerService.getPartnerById(req.params.id);
      res.status(200).json(partner);
    } catch (err) {
      next(err);
    }
  };

  public getPartnerByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const partner = await this.partnerService.getPartnerByUserId(req.params.userId);
      res.status(200).json(partner);
    } catch (err) {
      next(err);
    }
  };

  public createPartner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const partner = await this.partnerService.createPartner(req.body);
      res.status(201).json(partner);
    } catch (err) {
      next(err);
    }
  };

  public updatePartner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const partner = await this.partnerService.updatePartner(req.params.id, req.body);
      res.status(200).json(partner);
    } catch (err) {
      next(err);
    }
  };

  public deletePartner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.partnerService.deletePartner(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
