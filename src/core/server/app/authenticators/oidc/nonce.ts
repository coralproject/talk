import cookie from "cookie";
import crypto from "crypto";
import { Request, Response } from "express";
import compare from "tsscmp";

const COOKIE_NAME = "oidc:nonce";

function createNonce() {
  return crypto
    .randomBytes(12)
    .toString("base64")
    .replace("+", "-")
    .replace("/", "_");
}

export function storeNonce(
  req: Request,
  res: Response,
  secure: boolean
): string {
  const nonce = createNonce();

  res.cookie(COOKIE_NAME, nonce, {
    httpOnly: true,
    secure,
  });

  return nonce;
}

export function verifyNonce(
  req: Request,
  res: Response,
  providedNonce: string,
  secure: boolean
) {
  // Get the nonce from the cookie that's on the request.
  const header = req.headers.cookie;
  if (typeof header !== "string" || header.length === 0) {
    throw new Error("missing nonce cookie");
  }

  // Parse the cookie header.
  const cookies = cookie.parse(header);

  // Pull the nonce from the cookie.
  const nonce = cookies[COOKIE_NAME];
  if (!nonce || typeof nonce !== "string") {
    throw new Error("missing nonce cookie");
  }

  // Clear the cookie (because we're done with it now).
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure,
  });

  // Ensure that the nonce matches.
  if (!compare(nonce, providedNonce)) {
    throw new Error("nonce mismatch");
  }
}
