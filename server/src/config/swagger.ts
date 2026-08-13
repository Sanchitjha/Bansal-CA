import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Amit Bansal & Associates API",
      version: "1.0.0",
      description: "REST API for the Bansal & Associates platform",
    },
    servers: [{ url: `http://localhost:${env.port}`, description: "Current server" }],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.route.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
