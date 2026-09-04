import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { ServiceController } from "./service.controller";

/**
 * @openapi
 * tags:
 *   name: Services
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       additionalProperties: true
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *     ServiceInput:
 *       type: object
 *       additionalProperties: true
 *     Pricing:
 *       type: object
 *       additionalProperties: true
 *     RevenueRule:
 *       type: object
 *       additionalProperties: true
 * /api/services:
 *   get:
 *     summary: List all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Service' } }
 *   post:
 *     summary: Create a service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ServiceInput' }
 *     responses:
 *       201:
 *         description: Created service
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Service' }
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Service' }
 *       404:
 *         description: Service not found
 *   put:
 *     summary: Update a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ServiceInput' }
 *     responses:
 *       200:
 *         description: Updated service
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Service' }
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 * /api/services/{id}/pricing:
 *   get:
 *     summary: Get pricing entries for a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of pricing entries
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Pricing' } }
 *   post:
 *     summary: Add a pricing entry to a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Pricing' }
 *     responses:
 *       201:
 *         description: Created pricing entry
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Pricing' }
 * /api/services/{id}/revenue-rules:
 *   get:
 *     summary: Get revenue rules for a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of revenue rules
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/RevenueRule' } }
 *   post:
 *     summary: Add a revenue rule to a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RevenueRule' }
 *     responses:
 *       201:
 *         description: Created revenue rule
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/RevenueRule' }
 */
export class ServiceRoute implements IRoute {
  public path = "/api/services";
  public router = Router();

  constructor(private readonly controller: ServiceController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.controller.getServices);
    this.router.get("/:id", this.controller.getServiceById);
    this.router.post("/", this.controller.createService);
    this.router.put("/:id", this.controller.updateService);
    this.router.delete("/:id", this.controller.deleteService);

    // Sub-resources: Pricing and Revenue Rules
    this.router.get("/:id/pricing", this.controller.getPricing);
    this.router.post("/:id/pricing", this.controller.addPricing);
    this.router.get("/:id/revenue-rules", this.controller.getRevenueRules);
    this.router.post("/:id/revenue-rules", this.controller.addRevenueRule);
  }
}
