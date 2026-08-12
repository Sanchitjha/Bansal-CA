import mongoose from "mongoose";
import { env } from "./env";

export class Database {
  public async connect(): Promise<void> {
    await mongoose.connect(env.mongodbUri);
    console.log("Connected to MongoDB");
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
