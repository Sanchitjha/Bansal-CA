import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { PartnerController } from "./partner.controller";

/**
 * @openapi
 * tags:
 *   name: Partners
 * components:
 *   schemas:
 *     Partner:
 *       type: object
 *       additionalProperties: true
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *     PartnerInput:
 *       type: object
 *       additionalProperties: true
 * /api/partners:
 *   get:
 *     summary: List all partners
 *     tags: [Partners]
 *     responses:
 *       200:
 *         description: List of partners
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Partner' } }
 *   post:
 *     summary: Create a partner
 *     tags: [Partners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PartnerInput' }
 *     responses:
 *       201:
 *         description: Created partner
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Partner' }
 * /api/partners/{id}:
 *   get:
 *     summary: Get a partner by ID
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Partner found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Partner' }
 *       404:
 *         description: Partner not found
 *   put:
 *     summary: Update a partner
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PartnerInput' }
 *     responses:
 *       200:
 *         description: Updated partner
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Partner' }
 *   delete:
 *     summary: Delete a partner
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 */
export class PartnerRoute implements IRoute {
  public path = "/api/partners";
  public router = Router();

  constructor(private readonly controller: PartnerController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.controller.getPartners);
    this.router.get("/:id", this.controller.getPartnerById);
    this.router.post("/", this.controller.createPartner);
    this.router.put("/:id", this.controller.updatePartner);
    this.router.delete("/:id", this.controller.deletePartner);
  }
}
