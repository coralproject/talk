import cookie from "cookie";
import crypto from "crypto";
import { CookieOptions, Request, Response } from "express";
import compare from "tsscmp";

const COOKIE_NAME = "oauth2:state";
const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
};

function createState() {
  return crypto
    .randomBytes(12)
    .toString("base64")
    .replace("+", "-")
    .replace("/", "_");
}

export function storeState(req: Request, res: Response): string {
  const state = createState();

  res.cookie(COOKIE_NAME, state, COOKIE_OPTIONS);

  return state;
}

export function verifyState(req: Request, res: Response) {
  // Get the state from the cookie that's on the request.
  const header = req.headers.cookie;
  if (typeof header !== "string" || header.length === 0) {
    throw new Error("missing state cookie");
  }

  // Parse the cookie header.
  const cookies = cookie.parse(header);

  // Pull the state from the cookie.
  const state = cookies[COOKIE_NAME];
  if (!state || typeof state !== "string") {
    throw new Error("missing state cookie");
  }

  // Clear the cookie (because we're done with it now).
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);

  // Get the nonce that's stored on the query.
  const { state: providedState } = req.query;
  if (!providedState || typeof providedState !== "string") {
    throw new Error("missing state parameter");
  }

  // Ensure that the nonce is stored in the state.
  if (compare(state, providedState)) {
    throw new Error("state nonce mismatch");
  }
}
