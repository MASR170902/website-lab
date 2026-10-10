import { scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

const HASH_BYTES = 64;
const SCRYPT_OPTIONS = { N: 1 << 15, r: 8, p: 1, maxmem: 128 * 1024 * 1024 };

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, HASH_BYTES, SCRYPT_OPTIONS, (error, key) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(key);
    });
  });
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (password.length < 12 || password.length > 1024) return false;

  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!storedHash) {
    throw new Error("ADMIN_PASSWORD_HASH is not configured.");
  }

  const [algorithm, saltHex, hashHex, extra] = storedHash.split(":");
  if (
    algorithm !== "scrypt-v1" ||
    !saltHex ||
    !hashHex ||
    extra !== undefined ||
    !/^[0-9a-f]+$/i.test(saltHex) ||
    !/^[0-9a-f]+$/i.test(hashHex) ||
    saltHex.length !== 32
  ) {
    throw new Error("ADMIN_PASSWORD_HASH has an invalid format.");
  }

  const expectedHash = Buffer.from(hashHex, "hex");
  if (expectedHash.length !== HASH_BYTES) {
    throw new Error("ADMIN_PASSWORD_HASH has an invalid hash length.");
  }

  const actualHash = await deriveKey(password, Buffer.from(saltHex, "hex"));
  return timingSafeEqual(actualHash, expectedHash);
}
