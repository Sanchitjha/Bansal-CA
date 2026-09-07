import { Types } from "mongoose";
import { BadRequestException, NotFoundException } from "../../common/errors/http-exception";
import { CaseRepository } from "./case.repository";
import {
  ICase,
  ICaseWithId,
  ICaseTask,
  ICaseTaskWithId,
  IDocument,
  IDocumentWithId,
  CaseStatus,
} from "./case.types";
import { DynamicFormService } from "../service/dynamic-form.service";
import { RoutingEngine } from "../partner/routing.engine";
import { StateMachineService } from "./state-machine.service";

export class CaseService {
  private readonly dynamicFormService = new DynamicFormService();
  private readonly routingEngine = new RoutingEngine();
  private readonly stateMachineService = new StateMachineService();

  constructor(private readonly caseRepository: CaseRepository) {}

  // Case Methods
  public async getCases(clientId?: string, partnerId?: string): Promise<ICaseWithId[]> {
    if (clientId) {
      return this.caseRepository.findByClientId(clientId);
    }
    if (partnerId) {
      return this.caseRepository.findByPartnerId(partnerId);
    }
    return this.caseRepository.findAll();
  }

  public async getCaseById(id: string): Promise<ICaseWithId> {
    const caseObj = await this.caseRepository.findById(id);
    if (!caseObj) {
      throw new NotFoundException(`Case with id ${id} not found`);
    }
    return caseObj;
  }

  public async getCaseByNumber(caseNumber: string): Promise<ICaseWithId> {
    const caseObj = await this.caseRepository.findByCaseNumber(caseNumber);
    if (!caseObj) {
      throw new NotFoundException(`Case with number ${caseNumber} not found`);
    }
    return caseObj;
  }

  public async createCase(data: ICase): Promise<ICaseWithId> {
    if (
      !data.caseNumber ||
      !data.source ||
      !data.clientId ||
      !data.serviceId ||
      !data.serviceSnapshot ||
      !data.pricingSnapshot ||
      !data.revenueRuleSnapshot ||
      !data.workflowSnapshot
    ) {
      throw new BadRequestException("caseNumber, source, clientId, serviceId, and configuration snapshots are required");
    }
    const existing = await this.caseRepository.findByCaseNumber(data.caseNumber);
    if (existing) {
      throw new BadRequestException(`Case with number ${data.caseNumber} already exists`);
    }
    return this.caseRepository.create(data);
  }

  // Submit Case Flow: Revalidates form data and runs automatic routing engine
  public async submitCase(caseId: string, submittedFormData?: Record<string, any>): Promise<ICaseWithId> {
    const caseObj = await this.getCaseById(caseId);

    // 1. Revalidate submitted form data against versioned form schema if provided
    if (submittedFormData) {
      await this.dynamicFormService.validateFormData(
        caseObj.serviceId.toString(),
        caseObj.formSchemaVersion || 1,
        submittedFormData
      );
    }

    // 2. Run Automatic Routing Engine
    const routingResult = await this.routingEngine.routeRequest({
      caseId,
      serviceId: caseObj.serviceId.toString(),
    });

    const updated = await this.caseRepository.update(caseId, {
      submittedFormData,
      status: routingResult.status,
      partnerId: routingResult.partnerId ? new Types.ObjectId(routingResult.partnerId) : undefined,
    });

    return updated!;
  }

  // Transition Status via State Machine
  public async transitionStatus(
    caseId: string,
    nextStatus: CaseStatus,
    actorId?: string,
    actorType: "USER" | "SYSTEM" | "PARTNER" | "CUSTOMER" = "USER",
    reason?: string
  ): Promise<ICaseWithId> {
    await this.stateMachineService.transitionState(caseId, nextStatus, actorId, actorType, reason);
    return this.getCaseById(caseId);
  }

  public async updateCase(id: string, data: Partial<ICase>): Promise<ICaseWithId> {
    const updated = await this.caseRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Case with id ${id} not found`);
    }
    return updated;
  }

  // Task Methods
  public async getTasks(caseId: string): Promise<ICaseTaskWithId[]> {
    await this.getCaseById(caseId);
    return this.caseRepository.findTasksByCaseId(caseId);
  }

  public async createTask(caseId: string, taskData: Omit<ICaseTask, "caseId">): Promise<ICaseTaskWithId> {
    await this.getCaseById(caseId);
    return this.caseRepository.createTask({
      ...taskData,
      caseId: new Types.ObjectId(caseId),
    });
  }

  public async updateTask(taskId: string, data: Partial<ICaseTask>): Promise<ICaseTaskWithId> {
    const updated = await this.caseRepository.updateTask(taskId, data);
    if (!updated) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    return updated;
  }

  // Document Methods (Polymorphic)
  public async getDocuments(ownerId: string, ownerType: "PARTNER" | "CLIENT" | "CASE"): Promise<IDocumentWithId[]> {
    return this.caseRepository.findDocumentsByOwner(ownerId, ownerType);
  }

  public async uploadDocument(
    ownerId: string,
    ownerType: "PARTNER" | "CLIENT" | "CASE",
    docData: Omit<IDocument, "ownerId" | "ownerType" | "status">
  ): Promise<IDocumentWithId> {
    return this.caseRepository.createDocument({
      ...docData,
      ownerId: new Types.ObjectId(ownerId),
      ownerType,
      status: "UPLOADED",
    });
  }

  public async verifyDocument(docId: string, reviewerId: string, status: "ACCEPTED" | "REJECTED" | "RE_UPLOAD_REQUIRED", reason?: string): Promise<IDocumentWithId> {
    const updateData: Partial<IDocument> = {
      status,
      reviewedBy: new Types.ObjectId(reviewerId),
      reviewedAt: new Date(),
    };
    if (reason) {
      updateData.rejectionReason = reason;
    }
    const updated = await this.caseRepository.updateDocument(docId, updateData);
    if (!updated) {
      throw new NotFoundException(`Document with id ${docId} not found`);
    }
    return updated;
  }
}
