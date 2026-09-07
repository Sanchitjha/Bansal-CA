import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export class Database {
  public isConnected = false;

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(env.mongodbUri, {
        serverSelectionTimeoutMS: 2000,
      });
      this.isConnected = true;
      logger.info("Connected to MongoDB successfully.");
    } catch (err: any) {
      this.isConnected = false;
      logger.warn(`MongoDB is offline at ${env.mongodbUri}. Server operating in Standalone Development Mode.`);
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
    }
  }
}
