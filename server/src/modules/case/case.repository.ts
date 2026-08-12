import { Model } from "mongoose";
import { CaseModel } from "./case.model";
import { CaseTaskModel } from "./task.model";
import { DocumentModel } from "./document.model";
import {
  ICase,
  ICaseWithId,
  ICaseTask,
  ICaseTaskWithId,
  IDocument,
  IDocumentWithId,
} from "./case.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCaseWithId(doc: any): ICaseWithId {
  return {
    id: String(doc._id),
    caseNumber: doc.caseNumber,
    leadId: doc.leadId ? String(doc.leadId) : null,
    source: doc.source,
    partnerId: doc.partnerId ? String(doc.partnerId) : null,
    clientId: String(doc.clientId),
    serviceId: String(doc.serviceId),
    serviceSnapshot: doc.serviceSnapshot,
    pricingSnapshot: doc.pricingSnapshot,
    revenueRuleSnapshot: doc.revenueRuleSnapshot,
    workflowSnapshot: doc.workflowSnapshot,
    assignedTo: doc.assignedTo ? String(doc.assignedTo) : null,
    priority: doc.priority,
    status: doc.status,
    paymentStatus: doc.paymentStatus,
    invoiceStatus: doc.invoiceStatus,
    revenueShareStatus: doc.revenueShareStatus,
    openedAt: doc.openedAt,
    dueAt: doc.dueAt,
    closedAt: doc.closedAt,
    notes: doc.notes,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTaskWithId(doc: any): ICaseTaskWithId {
  return {
    id: String(doc._id),
    caseId: String(doc.caseId),
    title: doc.title,
    description: doc.description,
    assignedToUserId: doc.assignedToUserId ? String(doc.assignedToUserId) : null,
    assignedRole: doc.assignedRole,
    status: doc.status,
    priority: doc.priority,
    dueAt: doc.dueAt,
    completedAt: doc.completedAt,
    completedBy: doc.completedBy ? String(doc.completedBy) : undefined,
    completionRequirements: doc.completionRequirements,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDocumentWithId(doc: any): IDocumentWithId {
  return {
    id: String(doc._id),
    ownerId: String(doc.ownerId),
    ownerType: doc.ownerType,
    documentType: doc.documentType,
    fileId: doc.fileId,
    storageKey: doc.storageKey,
    originalFileName: doc.originalFileName,
    status: doc.status,
    uploadedBy: doc.uploadedBy ? String(doc.uploadedBy) : null,
    reviewedBy: doc.reviewedBy ? String(doc.reviewedBy) : null,
    reviewedAt: doc.reviewedAt,
    rejectionReason: doc.rejectionReason,
    expiresAt: doc.expiresAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export class CaseRepository {
  constructor(
    private readonly caseModel: Model<ICase> = CaseModel,
    private readonly taskModel: Model<ICaseTask> = CaseTaskModel,
    private readonly docModel: Model<IDocument> = DocumentModel
  ) {}

  // Case Core
  public async findAll(): Promise<ICaseWithId[]> {
    const docs = await this.caseModel.find().lean();
    return docs.map(toCaseWithId);
  }

  public async findById(id: string): Promise<ICaseWithId | null> {
    const doc = await this.caseModel.findById(id).lean();
    return doc ? toCaseWithId(doc) : null;
  }

  public async findByCaseNumber(caseNumber: string): Promise<ICaseWithId | null> {
    const doc = await this.caseModel.findOne({ caseNumber }).lean();
    return doc ? toCaseWithId(doc) : null;
  }

  public async create(data: ICase): Promise<ICaseWithId> {
    const doc = await this.caseModel.create(data);
    return toCaseWithId(doc);
  }

  public async update(id: string, data: Partial<ICase>): Promise<ICaseWithId | null> {
    const doc = await this.caseModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? toCaseWithId(doc) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.caseModel.findByIdAndDelete(id);
    return result !== null;
  }

  // Tasks
  public async findTasksByCaseId(caseId: string): Promise<ICaseTaskWithId[]> {
    const docs = await this.taskModel.find({ caseId }).lean();
    return docs.map(toTaskWithId);
  }

  public async createTask(data: ICaseTask): Promise<ICaseTaskWithId> {
    const doc = await this.taskModel.create(data);
    return toTaskWithId(doc);
  }

  public async updateTask(id: string, data: Partial<ICaseTask>): Promise<ICaseTaskWithId | null> {
    const doc = await this.taskModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? toTaskWithId(doc) : null;
  }

  // Documents
  public async findDocumentsByOwner(ownerId: string, ownerType: "PARTNER" | "CLIENT" | "CASE"): Promise<IDocumentWithId[]> {
    const docs = await this.docModel.find({ ownerId, ownerType }).lean();
    return docs.map(toDocumentWithId);
  }

  public async createDocument(data: IDocument): Promise<IDocumentWithId> {
    const doc = await this.docModel.create(data);
    return toDocumentWithId(doc);
  }

  public async updateDocument(id: string, data: Partial<IDocument>): Promise<IDocumentWithId | null> {
    const doc = await this.docModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? toDocumentWithId(doc) : null;
  }
}
