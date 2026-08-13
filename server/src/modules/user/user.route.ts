import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { UserController } from "./user.controller";

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User account management
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       additionalProperties: true
 *       properties:
 *         _id: { type: string }
 *         externalId: { type: string }
 *         name: { type: string }
 *         email: { type: string }
 *     UserInput:
 *       type: object
 *       additionalProperties: true
 */
export class UserRoute implements IRoute {
  public path = "/api/users";
  public router = Router();

  constructor(private readonly controller: UserController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.controller.getUsers);
    this.router.get("/external/:externalId", this.controller.getUserByExternalId);
    this.router.get("/:id", this.controller.getUserById);
    this.router.post("/", this.controller.createUser);
    this.router.put("/:id", this.controller.updateUser);
    this.router.delete("/:id", this.controller.deleteUser);
  }
}

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserInput' }
 *     responses:
 *       201:
 *         description: Created user
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 * /api/users/external/{externalId}:
 *   get:
 *     summary: Get a user by external ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: externalId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: User not found
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserInput' }
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 */
