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
    this.router.post("/signup", this.controller.signup);
    this.router.post("/login", this.controller.login);
    this.router.post("/admin-login", this.controller.adminLogin);
    this.router.get("/external/:externalId", this.controller.getUserByExternalId);
    this.router.get("/:id", this.controller.getUserById);
    this.router.post("/", this.controller.createUser);
    this.router.put("/:id", this.controller.updateUser);
    this.router.delete("/:id", this.controller.deleteUser);
  }
}

/**
 * @openapi
 * /api/users/signup:
 *   post:
 *     summary: Client Signup
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName]
 *             properties:
 *               email: { type: string, example: client@example.com }
 *               password: { type: string, example: secret123 }
 *               firstName: { type: string, example: John }
 *               lastName: { type: string, example: Doe }
 *               phone: { type: string, example: "+1234567890" }
 *               legalName: { type: string, example: "John Doe Consulting" }
 *               clientType: { type: string, enum: [INDIVIDUAL, BUSINESS], default: INDIVIDUAL }
 *     responses:
 *       201:
 *         description: Registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { $ref: '#/components/schemas/User' }
 *                 client: { $ref: '#/components/schemas/Client' }
 *       400:
 *         description: Bad request
 * /api/users/login:
 *   post:
 *     summary: Client Login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: client@example.com }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       200:
 *         description: Authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { $ref: '#/components/schemas/User' }
 *                 client: { $ref: '#/components/schemas/Client' }
 *       400:
 *         description: Invalid credentials
 * /api/users/admin-login:
 *   post:
 *     summary: Admin Login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: amit.bansal@aa.com }
 *               password: { type: string, example: admin123 }
 *     responses:
 *       200:
 *         description: Authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Invalid credentials / Unauthorized
 */

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
