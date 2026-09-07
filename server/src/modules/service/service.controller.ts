import { NextFunction, Request, Response } from "express";
import { ServiceService } from "./service.service";

export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // Form Schemas
  public createFormSchema = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const schema = await this.serviceService.createFormSchema(req.body);
      res.status(201).json(schema);
    } catch (err) {
      next(err);
    }
  };

  public getFormSchemas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { serviceId } = req.query as { serviceId?: string };
      const schemas = await this.serviceService.getFormSchemas(serviceId);
      res.status(200).json(schemas);
    } catch (err) {
      next(err);
    }
  };

  // Service Versions
  public createServiceVersion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const version = await this.serviceService.createServiceVersion(req.body);
      res.status(201).json(version);
    } catch (err) {
      next(err);
    }
  };

  public getServiceVersions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const versions = await this.serviceService.getServiceVersions(req.params.id);
      res.status(200).json(versions);
    } catch (err) {
      next(err);
    }
  };

  // Services CRUD
  public getServices = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const services = await this.serviceService.getServices();
      res.status(200).json(services);
    } catch (err) {
      next(err);
    }
  };

  public getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const service = await this.serviceService.getServiceById(req.params.id);
      res.status(200).json(service);
    } catch (err) {
      next(err);
    }
  };

  public createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const service = await this.serviceService.createService(req.body);
      res.status(201).json(service);
    } catch (err) {
      next(err);
    }
  };

  public updateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const service = await this.serviceService.updateService(req.params.id, req.body);
      res.status(200).json(service);
    } catch (err) {
      next(err);
    }
  };

  public deleteService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.serviceService.deleteService(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  // Pricing & Revenue overrides
  public getPricing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pricing = await this.serviceService.getPricing(req.params.id);
      res.status(200).json(pricing);
    } catch (err) {
      next(err);
    }
  };

  public addPricing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pricing = await this.serviceService.addPricing(req.params.id, req.body);
      res.status(201).json(pricing);
    } catch (err) {
      next(err);
    }
  };

  public getRevenueRules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rules = await this.serviceService.getRevenueRules(req.params.id);
      res.status(200).json(rules);
    } catch (err) {
      next(err);
    }
  };

  public addRevenueRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rule = await this.serviceService.addRevenueRule(req.params.id, req.body);
      res.status(201).json(rule);
    } catch (err) {
      next(err);
    }
  };
}
