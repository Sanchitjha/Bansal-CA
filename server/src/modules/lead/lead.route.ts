import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { Authenticate } from "../../common/middlewares/auth.middleware";
import { LeadController } from "./lead.controller";

/**
 * @openapi
 * tags:
 *   name: Leads
 * components:
 *   schemas:
 *     Lead:
 *       type: object
 *       additionalProperties: true
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *     LeadInput:
 *       type: object
 *       additionalProperties: true
 * /api/leads:
 *   get:
 *     summary: List all leads
 *     tags: [Leads]
 *     responses:
 *       200:
 *         description: List of leads
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Lead' } }
 *   post:
 *     summary: Create a lead
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LeadInput' }
 *     responses:
 *       201:
 *         description: Created lead
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Lead' }
 * /api/leads/{id}:
 *   get:
 *     summary: Get a lead by ID
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lead found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Lead' }
 *       404:
 *         description: Lead not found
 *   put:
 *     summary: Update a lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LeadInput' }
 *     responses:
 *       200:
 *         description: Updated lead
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Lead' }
 *   delete:
 *     summary: Delete a lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 */
export class LeadRoute implements IRoute {
  public path = "/api/leads";
  public router = Router();

  constructor(
    private readonly controller: LeadController,
    private readonly authMiddleware?: Authenticate
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const auth = this.authMiddleware ? [this.authMiddleware.handle] : [];

    this.router.get("/", ...auth, this.controller.getLeads);
    this.router.get("/:id", ...auth, this.controller.getLeadById);
    this.router.post("/", ...auth, this.controller.createLead);
    this.router.put("/:id", ...auth, this.controller.updateLead);
    this.router.delete("/:id", ...auth, this.controller.deleteLead);
  }
}
