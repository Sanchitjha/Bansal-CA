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

export const env: EnvConfig = {
  port: Number(process.env.PORT ?? 5000),
  mongodbUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/bansal_ca",
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientUrl: process.env.CLIENT_URL ?? "*",
  jwtSecret: process.env.JWT_SECRET ?? "super-secret-jwt-key-change-in-production-2026",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 12),
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL ?? "admin@bansalca.local",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD ?? "admin123",
  seedAdminFirstName: process.env.SEED_ADMIN_FIRST_NAME ?? "Platform",
  seedAdminLastName: process.env.SEED_ADMIN_LAST_NAME ?? "Admin",
};
