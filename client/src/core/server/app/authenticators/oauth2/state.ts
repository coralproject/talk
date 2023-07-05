import cookie from "cookie";
import crypto from "crypto";
import { Request, Response } from "express";

import { REDIRECT_TO_PARAM } from "coral-common/constants";

const COOKIE_NAME = "oauth2:state";

export interface StateData {
  redirectTo: string;
}

function createState(data: StateData) {
  const key = crypto
    .randomBytes(12)
    .toString("base64")
    .replace("+", "-")
    .replace("/", "_");

  const state = JSON.stringify({ [key]: data });

  return { state, key };
}

export function storeState(
  req: Request,
  res: Response,
  secure: boolean
): string {
  // Unpack the redirection.
  const { [REDIRECT_TO_PARAM]: redirectTo } = req.query;
  if (
    !redirectTo ||
    typeof redirectTo !== "string" ||
    // Do not allow absolute urls to be used.
    /\/\//.test(redirectTo)
  ) {
    throw new Error("invalid redirect parameter");
  }

  const { state, key } = createState({ redirectTo });

  res.cookie(COOKIE_NAME, state, {
    httpOnly: true,
    secure,
  });

  return key;
}

export function verifyState(req: Request, res: Response, secure: boolean) {
  // Get the state from the cookie that's on the request.
  const header = req.headers.cookie;
  if (typeof header !== "string" || header.length === 0) {
    throw new Error("missing state cookie");
  }

  // Parse the cookie header.
  const cookies = cookie.parse(header);

  // Pull the state from the cookie.
  const stateString = cookies[COOKIE_NAME];
  if (!stateString || typeof stateString !== "string") {
    throw new Error("missing state cookie");
  }

  // Clear the cookie (because we're done with it now).
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure,
  });

  let state: Partial<Record<string, StateData>>;

  // We expect that the state data is JSON encoded.
  try {
    state = JSON.parse(stateString);
  } catch {
    throw new Error("state data is corrupted");
  }

  // Get the nonce that's stored on the query.
  const { state: key } = req.query;
  if (!key || typeof key !== "string") {
    throw new Error("missing state parameter");
  }

  // Try to get the data from the state using the query key.
  const data = state[key];

  if (!data) {
    throw new Error("state mismatch");
  }

  return data;
}
