import { Router } from "express";
import { IRoute } from "../../common/interfaces/route.interface";
import { CaseController } from "./case.controller";

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
