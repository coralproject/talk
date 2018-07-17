import { Request } from "talk-server/types/express";

const re = /(\S+)\s+(\S+)/;

export function parseAuthHeader(header: string) {
  const matches = header.match(re);
  if (!matches || matches.length < 3) {
    return null;
  }

  return {
    scheme: matches[1].toLowerCase(),
    value: matches[2],
  };
}

export function extractJWTFromRequest(req: Request) {
  const header = req.get("authorization");
  if (header) {
    const parts = parseAuthHeader(header);
    if (parts && parts.scheme === "bearer") {
      return parts.value;
    }
  }

  const token: string | undefined | false = req.query && req.query.access_token;
  if (token) {
    return token;
  }

  return null;
}
