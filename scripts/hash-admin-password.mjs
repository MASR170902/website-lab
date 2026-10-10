import { randomBytes, scryptSync } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const { stdin, stdout } = process;
const envPath = path.join(process.cwd(), ".env.local");

if (!stdin.isTTY || !stdout.isTTY) {
  console.error("Run this script in an interactive terminal.");
  process.exit(1);
}

stdout.write("New admin password (input hidden): ");
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding("utf8");

let password = "";

function finish() {
  stdin.setRawMode(false);
  stdin.pause();
}

function savePasswordHash(password) {
  let current = "";
  try {
    const stat = fs.lstatSync(envPath);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      throw new Error(".env.local must be a regular file, not a symlink.");
    }
    current = fs.readFileSync(envPath, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64, {
    N: 1 << 15,
    r: 8,
    p: 1,
    maxmem: 128 * 1024 * 1024,
  });
  const passwordHash = `scrypt-v1:${salt.toString("hex")}:${hash.toString("hex")}`;
  const lines = current ? current.replace(/\r\n/g, "\n").split("\n") : [];
  const output = [];
  let hashSaved = false;
  let sessionConfigured = false;

  for (const line of lines) {
    if (line.startsWith("ADMIN_PASSWORD_HASH=")) {
      if (!hashSaved) {
        output.push(`ADMIN_PASSWORD_HASH=${passwordHash}`);
        hashSaved = true;
      }
    } else if (line.startsWith("ADMIN_SESSION_SECRET=")) {
      if (!sessionConfigured) {
        const value = line.slice("ADMIN_SESSION_SECRET=".length).trim();
        output.push(
          `ADMIN_SESSION_SECRET=${value || randomBytes(48).toString("base64")}`,
        );
        sessionConfigured = Boolean(value);
      }
    } else if (line) {
      output.push(line);
    }
  }

  if (!hashSaved) output.push(`ADMIN_PASSWORD_HASH=${passwordHash}`);
  if (!sessionConfigured && !output.some((line) => line.startsWith("ADMIN_SESSION_SECRET="))) {
    output.push(`ADMIN_SESSION_SECRET=${randomBytes(48).toString("base64")}`);
  }

  const temporaryPath = `${envPath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, `${output.join("\n")}\n`, {
    encoding: "utf8",
    mode: 0o600,
    flag: "wx",
  });
  fs.renameSync(temporaryPath, envPath);
  fs.chmodSync(envPath, 0o600);
}

stdin.on("data", (input) => {
  for (const character of input) {
    if (character === "\u0003") {
      finish();
      stdout.write("\nCancelled.\n");
      process.exit(1);
    }

    if (character === "\r" || character === "\n") {
      finish();
      stdout.write("\n");
      if (password.length < 12) {
        console.error("Use an admin password with at least 12 characters.");
        process.exitCode = 1;
        return;
      }

      try {
        savePasswordHash(password);
        console.log("Password hash saved to .env.local. No hash or password was printed.");
      } catch (error) {
        console.error(error instanceof Error ? error.message : "Could not update .env.local.");
        process.exitCode = 1;
      }
      password = "";
      return;
    }

    if (character === "\u007f" || character === "\b") {
      password = password.slice(0, -1);
    } else if (character >= " ") {
      password += character;
    }
  }
});
