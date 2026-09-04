import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  port: number;
  mongodbUri: string;
  nodeEnv: string;
  clientUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptSaltRounds: number;
  seedAdminEmail: string;
  seedAdminPassword: string;
  seedAdminFirstName: string;
  seedAdminLastName: string;
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
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 12),
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL ?? "admin@bansalca.local",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD ?? "",
  seedAdminFirstName: process.env.SEED_ADMIN_FIRST_NAME ?? "Platform",
  seedAdminLastName: process.env.SEED_ADMIN_LAST_NAME ?? "Admin",
};
