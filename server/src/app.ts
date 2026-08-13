import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { IRoute } from "./common/interfaces/route.interface";
import { ErrorMiddleware } from "./common/middlewares/error.middleware";
import { NotFoundMiddleware } from "./common/middlewares/not-found.middleware";
import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";

export class App {
  public app: Application;

  constructor(private readonly routes: IRoute[]) {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors({ origin: env.clientUrl }));
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
    this.app.get("/api-docs.json", (_req, res) => res.status(200).json(swaggerSpec));
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.routes.forEach((route) => {
      this.app.use(route.path, route.router);
    });
  }

  private initializeErrorHandling(): void {
    const notFoundMiddleware = new NotFoundMiddleware();
    const errorMiddleware = new ErrorMiddleware();
    this.app.use(notFoundMiddleware.handle);
    this.app.use(errorMiddleware.handle);
  }

  public listen(): void {
    this.app.listen(env.port, () => {
      console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
    });
  }
}
