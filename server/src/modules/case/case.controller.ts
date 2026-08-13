import { NextFunction, Request, Response } from "express";
import { CaseService } from "./case.service";

export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  // Case CRUD
  public getCases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { clientId } = req.query;
      const cases = await this.caseService.getCases(clientId as string);
      res.status(200).json(cases);
    } catch (err) {
      next(err);
    }
  };

  public getCaseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const caseObj = await this.caseService.getCaseById(req.params.id);
      res.status(200).json(caseObj);
    } catch (err) {
      next(err);
    }
  };

  public createCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const caseObj = await this.caseService.createCase(req.body);
      res.status(201).json(caseObj);
    } catch (err) {
      next(err);
    }
  };

  public updateCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const caseObj = await this.caseService.updateCase(req.params.id, req.body);
      res.status(200).json(caseObj);
    } catch (err) {
      next(err);
    }
  };

  // Case Tasks
  public getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tasks = await this.caseService.getTasks(req.params.id);
      res.status(200).json(tasks);
    } catch (err) {
      next(err);
    }
  };

  public createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.caseService.createTask(req.params.id, req.body);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  };

  public updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.caseService.updateTask(req.params.taskId, req.body);
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  };

  // Polymorphic Documents
  public getDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ownerType } = req.query;
      const documents = await this.caseService.getDocuments(
        req.params.id,
        ownerType as "PARTNER" | "CLIENT" | "CASE"
      );
      res.status(200).json(documents);
    } catch (err) {
      next(err);
    }
  };

  public uploadDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ownerType } = req.body;
      const doc = await this.caseService.uploadDocument(req.params.id, ownerType, req.body);
      res.status(201).json(doc);
    } catch (err) {
      next(err);
    }
  };

  public verifyDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, reviewerId, reason } = req.body;
      const doc = await this.caseService.verifyDocument(
        req.params.docId,
        reviewerId,
        status,
        reason
      );
      res.status(200).json(doc);
    } catch (err) {
      next(err);
    }
  };
}
