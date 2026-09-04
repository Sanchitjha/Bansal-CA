import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { CaseController } from "./case.controller";

/**
 * @openapi
 * tags:
 *   name: Cases
 * components:
 *   schemas:
 *     Case:
 *       type: object
 *       additionalProperties: true
 *       properties:
 *         _id: { type: string }
 *     CaseInput:
 *       type: object
 *       additionalProperties: true
 *     Task:
 *       type: object
 *       additionalProperties: true
 *     Document:
 *       type: object
 *       additionalProperties: true
 * /api/cases:
 *   get:
 *     summary: List all cases
 *     tags: [Cases]
 *     responses:
 *       200:
 *         description: List of cases
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Case' } }
 *   post:
 *     summary: Create a case
 *     tags: [Cases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CaseInput' }
 *     responses:
 *       201:
 *         description: Created case
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Case' }
 * /api/cases/{id}:
 *   get:
 *     summary: Get a case by ID
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Case found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Case' }
 *       404:
 *         description: Case not found
 *   put:
 *     summary: Update a case
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CaseInput' }
 *     responses:
 *       200:
 *         description: Updated case
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Case' }
 * /api/cases/{id}/tasks:
 *   get:
 *     summary: Get tasks for a case
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Task' } }
 *   post:
 *     summary: Create a task for a case
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Task' }
 *     responses:
 *       201:
 *         description: Created task
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Task' }
 * /api/cases/{id}/tasks/{taskId}:
 *   put:
 *     summary: Update a task
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Task' }
 *     responses:
 *       200:
 *         description: Updated task
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Task' }
 * /api/cases/{id}/documents:
 *   get:
 *     summary: Get documents for a case
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of documents
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Document' } }
 *   post:
 *     summary: Upload a document for a case
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Document' }
 *     responses:
 *       201:
 *         description: Created document
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Document' }
 * /api/cases/{id}/documents/{docId}/verify:
 *   put:
 *     summary: Verify a document
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: docId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Verified document
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Document' }
 */
export class CaseRoute implements IRoute {
  public path = "/api/cases";
  public router = Router();

  constructor(private readonly controller: CaseController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Core Cases
    this.router.get("/", this.controller.getCases);
    this.router.get("/:id", this.controller.getCaseById);
    this.router.post("/", this.controller.createCase);
    this.router.put("/:id", this.controller.updateCase);

    // Case Tasks
    this.router.get("/:id/tasks", this.controller.getTasks);
    this.router.post("/:id/tasks", this.controller.createTask);
    this.router.put("/:id/tasks/:taskId", this.controller.updateTask);

    // Polymorphic Documents
    this.router.get("/:id/documents", this.controller.getDocuments);
    this.router.post("/:id/documents", this.controller.uploadDocument);
    this.router.put("/:id/documents/:docId/verify", this.controller.verifyDocument);
  }
}
