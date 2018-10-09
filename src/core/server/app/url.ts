import { Request } from "talk-server/types/express";
import { URL } from "url";

export function reconstructURL(req: Request, path: string = "/"): string {
  const scheme = req.secure ? "https" : "http";
  const host = req.get("host");
  const base = `${scheme}://${host}`;

  const url = new URL(path, base);

  return url.href;
}

/**
 * extractParentURLHostname will pull the parent's hostname out.
 *
 * @param req the request where we want to extract the parent's hostname from.
 */
export function extractParentsHostname(req: Request) {
  // The only two places this could be is in the referer header or the parentUrl
  // query parameter (injected by pym.js). If both of these are empty, then we
  // can't find anything.
  if (!req.headers.referer && !req.query.parentUrl) {
    return null;
  }

  // If the referer header is defined, then use it.
  if (req.headers.referer && req.headers.referer.length > 0) {
    // If the header contains multiple values, return the first one.
    if (Array.isArray(req.headers.referer)) {
      return req.headers.referer[0];
    }

    return req.headers.referer;
  }

  // If the parentUrl query parameter is provided, then try to parse it.
  if (req.query.parentUrl) {
    try {
      return new URL(req.query.parentUrl).hostname;
    } catch (err) {
      // Parsing of the parentUrl failed, default to null.
      return null;
    }
  }

  return null;
}
