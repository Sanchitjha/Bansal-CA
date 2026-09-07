import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { CaseController } from "./case.controller";
import { Authenticate } from "../../common/middlewares/auth.middleware";

export class CaseRoute implements IRoute {
  public path = "/api/cases";
  public router = Router();

  constructor(
    private readonly controller: CaseController,
    private readonly authMiddleware?: Authenticate
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const auth = this.authMiddleware ? [this.authMiddleware.handle] : [];

    // Core Cases
    this.router.get("/", ...auth, this.controller.getCases);
    this.router.get("/:id", ...auth, this.controller.getCaseById);
    this.router.post("/", ...auth, this.controller.createCase);
    this.router.post("/:id/submit", ...auth, this.controller.submitCase);
    this.router.post("/:id/status", ...auth, this.controller.transitionStatus);
    this.router.put("/:id", ...auth, this.controller.updateCase);

    // Case Tasks
    this.router.get("/:id/tasks", ...auth, this.controller.getTasks);
    this.router.post("/:id/tasks", ...auth, this.controller.createTask);
    this.router.put("/:id/tasks/:taskId", ...auth, this.controller.updateTask);

    // Polymorphic Documents
    this.router.get("/:id/documents", ...auth, this.controller.getDocuments);
    this.router.post("/:id/documents", ...auth, this.controller.uploadDocument);
    this.router.put("/:id/documents/:docId/verify", ...auth, this.controller.verifyDocument);
  }
}
