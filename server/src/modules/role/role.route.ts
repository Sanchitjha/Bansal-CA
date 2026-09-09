import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { Authenticate } from "../../common/middlewares/auth.middleware";
import { RoleController } from "./role.controller";

/**
 * @openapi
 * tags:
 *   name: Roles
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       additionalProperties: true
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *     RoleInput:
 *       type: object
 *       additionalProperties: true
 * /api/roles:
 *   get:
 *     summary: List all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Role' } }
 *   post:
 *     summary: Create a role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RoleInput' }
 *     responses:
 *       201:
 *         description: Created role
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Role' }
 * /api/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Role found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Role' }
 *       404:
 *         description: Role not found
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RoleInput' }
 *     responses:
 *       200:
 *         description: Updated role
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Role' }
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 */
export class RoleRoute implements IRoute {
  public path = "/api/roles";
  public router = Router();

  constructor(
    private readonly controller: RoleController,
    private readonly authMiddleware?: Authenticate
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const auth = this.authMiddleware ? [this.authMiddleware.handle] : [];

    this.router.get("/", ...auth, this.controller.getRoles);
    this.router.get("/:id", ...auth, this.controller.getRoleById);
    this.router.post("/", ...auth, this.controller.createRole);
    this.router.put("/:id", ...auth, this.controller.updateRole);
    this.router.delete("/:id", ...auth, this.controller.deleteRole);
  }
}
