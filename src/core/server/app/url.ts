import { Request } from "talk-server/types/express";
import { URL } from "url";

export function reconstructURL(req: Request, path: string = "/"): string {
  const scheme = req.secure ? "https" : "http";
  const host = req.get("host");
  const base = `${scheme}://${host}`;

  const url = new URL(path, base);

  return url.href;
}

export function doesRequireSchemePrefixing(url: string) {
  return !url.startsWith("http");
}

export function isURLSecure(url: string) {
  if (doesRequireSchemePrefixing(url)) {
    return null;
  }

  return url.startsWith("https://");
}

export function getHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch (err) {
    return null;
  }
}

export function getOrigin(url: string) {
  try {
    return new URL(url).origin;
  } catch (err) {
    return null;
  }
}

export function prefixSchemeIfRequired(secure: boolean, url: string) {
  if (doesRequireSchemePrefixing(url)) {
    return (
      "http" +
      (secure ? "s" : "") +
      (url.indexOf("//") === -1 ? "://" : ":") +
      url
    );
  }

  return url;
}

/**
 * extractParentsOrigin will pull the parent's origin out.
 *
 * @param req the request where we want to extract the parent's hostname from.
 */
export function extractParentsOrigin(req: Request) {
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
      return getOrigin(req.headers.referer[0]);
    }

    return getOrigin(req.headers.referer);
  }

  // If the parentUrl query parameter is provided, then try to parse it.
  if (req.query.parentUrl) {
    return getOrigin(req.query.parentUrl);
  }

  return null;
}
