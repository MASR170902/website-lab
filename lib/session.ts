const SESSION_TTL_SECONDS = 8 * 60 * 60;
const encoder = new TextEncoder();

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function asArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

async function getSigningKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  }

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createAdminSession(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({
    issuedAt: now,
    expiresAt: now + SESSION_TTL_SECONDS,
    nonce: encodeBase64Url(crypto.getRandomValues(new Uint8Array(16))),
  });
  const encodedPayload = encodeBase64Url(encoder.encode(payload));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getSigningKey(),
    encoder.encode(encodedPayload),
  );

  return `${encodedPayload}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  try {
    const [encodedPayload, encodedSignature, extra] = token.split(".");
    if (!encodedPayload || !encodedSignature || extra !== undefined) return false;

    const validSignature = await crypto.subtle.verify(
      "HMAC",
      await getSigningKey(),
      asArrayBuffer(decodeBase64Url(encodedSignature)),
      encoder.encode(encodedPayload),
    );
    if (!validSignature) return false;

    const payload: unknown = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(encodedPayload)),
    );
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("issuedAt" in payload) ||
      !("expiresAt" in payload) ||
      !("nonce" in payload)
    ) {
      return false;
    }

    const session = payload as {
      issuedAt: unknown;
      expiresAt: unknown;
      nonce: unknown;
    };
    const now = Math.floor(Date.now() / 1000);
    return (
      typeof session.issuedAt === "number" &&
      typeof session.expiresAt === "number" &&
      typeof session.nonce === "string" &&
      session.nonce.length > 0 &&
      session.issuedAt <= now &&
      session.expiresAt > now &&
      session.expiresAt - session.issuedAt <= SESSION_TTL_SECONDS
    );
  } catch {
    return false;
  }
}

export { SESSION_TTL_SECONDS };
