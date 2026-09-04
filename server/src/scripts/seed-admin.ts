import mongoose, { Types } from "mongoose";
import { env } from "../config/env";
import { Database } from "../config/database";
import { RoleRepository } from "../modules/role/role.repository";
import { UserRepository } from "../modules/user/user.repository";
import { AuthService } from "../modules/auth/auth.service";

const ADMIN_ROLE_NAME = "ADMIN";
const ADMIN_PERMISSIONS = [
  "user.read",
  "user.write",
  "role.read",
  "role.write",
  "partner.read",
  "partner.write",
  "client.read",
  "client.write",
  "service.read",
  "service.write",
  "lead.read",
  "lead.write",
  "case.read",
  "case.write",
  "case.assign",
  "finance.read",
  "finance.write",
  "commission.approve",
  "audit.read",
];

async function main(): Promise<void> {
  if (!env.seedAdminPassword) {
    throw new Error(
      "SEED_ADMIN_PASSWORD is required in the environment to seed the admin user"
    );
  }

  const db = new Database();
  await db.connect();

  const roleRepository = new RoleRepository();
  const userRepository = new UserRepository();
  const authService = new AuthService(userRepository, roleRepository);

  let adminRole = await roleRepository.findByName(ADMIN_ROLE_NAME);
  if (!adminRole) {
    adminRole = await roleRepository.create({
      name: ADMIN_ROLE_NAME,
      permissions: ADMIN_PERMISSIONS,
      description: "Platform administrator — full access",
    });
    console.log(`Created role ${ADMIN_ROLE_NAME}`);
  } else {
    console.log(`Role ${ADMIN_ROLE_NAME} already exists — skipping`);
  }

  const existing = await userRepository.findByEmail(env.seedAdminEmail);
  if (existing) {
    console.log(`Admin user ${env.seedAdminEmail} already exists — skipping`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await authService.hashPassword(env.seedAdminPassword);
  const created = await userRepository.create({
    externalAuthId: `local:${env.seedAdminEmail}`,
    email: env.seedAdminEmail,
    firstName: env.seedAdminFirstName,
    lastName: env.seedAdminLastName,
    roleId: new Types.ObjectId(adminRole.id),
    status: "ACTIVE",
    passwordHash,
  });
  console.log(`Created admin user ${created.email} (id=${created.id})`);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
