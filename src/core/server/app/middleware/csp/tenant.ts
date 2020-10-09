import builder from "content-security-policy-builder";

import { extractParentsURL, getOrigin } from "coral-server/app/url";
import { isURLPermitted } from "coral-server/services/sites/url";
import { Request, RequestHandler } from "coral-server/types/express";

/**
 * cspMiddleware handles adding the CSP middleware to each outgoing request.
 */
export const cspSiteMiddleware: RequestHandler = async (req, res, next) => {
  // Get the site from the request.
  const { site } = req.coral;

  // Grab the origins from the site.
  const origins = site ? site.allowedOrigins : [];

  res.setHeader(
    "Content-Security-Policy",
    generateContentSecurityPolicy(origins)
  );

  // Add some fallbacks for IE.
  res.setHeader("X-Frame-Options", generateFrameOptions(req, origins));
  res.setHeader("X-XSS-Protection", "1; mode=block");

  next();
};

function generateContentSecurityPolicy(allowedOrigins: string[]) {
  // Only the domains that are allowed by the tenant may embed Coral.
  const frameAncestors =
    allowedOrigins.length > 0 ? ["'self'", ...allowedOrigins] : ["'none'"];

  // Build and return the directive.
  return builder({ directives: { frameAncestors } });
}

export function generateFrameOptions(req: Request, allowedOrigins: string[]) {
  // If there aren't any domains, then we reject it.
  if (allowedOrigins.length === 0) {
    return "deny";
  }

  // If there is only one domain on the tenant then return it!
  if (allowedOrigins.length === 1) {
    return `allow-from ${getOrigin(allowedOrigins[0])}`;
  }

  const parentsURL = extractParentsURL(req);
  if (!parentsURL) {
    return "deny";
  }

  // Grab the parent's origin.
  const parentsOrigin = getOrigin(parentsURL);
  if (!parentsOrigin) {
    return "deny";
  }

  // Determine if this origin is allowed.
  if (!isURLPermitted({ allowedOrigins }, parentsURL)) {
    return "deny";
  }

  // As we can only return a single domain in the `allow-from` directive as per
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  // We need to find the domain that is asking so we can respond with the right
  // result, sort of like CORS!
  const allowFrom = allowedOrigins
    .map((domain) => getOrigin(domain))
    .find((origin) => origin === parentsOrigin);
  if (!allowFrom) {
    return "deny";
  }

  return `allow-from ${allowFrom}`;
}
