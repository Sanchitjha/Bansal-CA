import crypto from "crypto";

/**
 * Hashes a plain text password using SHA-256.
 * @param password Plain text password
 * @returns Hashed password in hexadecimal format
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}
