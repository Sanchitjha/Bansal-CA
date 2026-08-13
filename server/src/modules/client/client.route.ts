import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { ClientController } from "./client.controller";

/**
 * @openapi
 * tags:
 *   name: Clients
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       additionalProperties: true
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *     ClientInput:
 *       type: object
 *       additionalProperties: true
 * /api/clients:
 *   get:
 *     summary: List all clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: List of clients
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Client' } }
 *   post:
 *     summary: Create a client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClientInput' }
 *     responses:
 *       201:
 *         description: Created client
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Client' }
 * /api/clients/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Client found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Client' }
 *       404:
 *         description: Client not found
 *   put:
 *     summary: Update a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClientInput' }
 *     responses:
 *       200:
 *         description: Updated client
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Client' }
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 */
export class ClientRoute implements IRoute {
  public path = "/api/clients";
  public router = Router();

  constructor(private readonly controller: ClientController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.controller.getClients);
    this.router.get("/:id", this.controller.getClientById);
    this.router.post("/", this.controller.createClient);
    this.router.put("/:id", this.controller.updateClient);
    this.router.delete("/:id", this.controller.deleteClient);
  }
}
