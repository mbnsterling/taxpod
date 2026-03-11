import { hash, compare } from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string) {
  return hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(options: {
  plain: string;
  hash: string;
}) {
  return compare(options.plain, options.hash);
}

