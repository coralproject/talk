import { IncomingMessage } from "http";

/**
 * Duplicates the functionality from expressjs:
 *
 * https://github.com/expressjs/express/blob/b8e50568af9c73ef1ade434e92c60d389868361d/lib/request.js#L416-L450
 *
 * @param req incoming request
 */
export function getHostname(req: IncomingMessage) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (!host || Array.isArray(host)) {
    return null;
  }

  // IPv6 literal support
  const offset = host.startsWith("[") ? host.indexOf("]") + 1 : 0;
  const index = host.indexOf(":", offset);

  return index !== -1 ? host.substring(0, index) : host;
}
