import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  port: number;
  mongodbUri: string;
  nodeEnv: string;
  clientUrl: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env: EnvConfig = {
  port: Number(process.env.PORT ?? 5000),
  mongodbUri: requireEnv("MONGODB_URI"),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
};
