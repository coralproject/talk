import cookie from "cookie";
import crypto from "crypto";
import { CookieOptions, Request, Response } from "express";

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

export function createAndStoreState(res: Response): string {
  const state = createState();

  res.cookie(COOKIE_NAME, state, COOKIE_OPTIONS);

  return state;
}

export function getAndClearState(req: Request, res: Response): string | null {
  const header = req.headers.cookie;
  if (typeof header !== "string" || header.length === 0) {
    return null;
  }

  const cookies = cookie.parse(header);

  const state = cookies[COOKIE_NAME];
  if (!state || typeof state !== "string") {
    return null;
  }

  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);

  return state;
}
