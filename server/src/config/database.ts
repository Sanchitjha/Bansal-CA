import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export class Database {
  public async connect(): Promise<void> {
    await mongoose.connect(env.mongodbUri);
    logger.info("Connected to MongoDB");
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
