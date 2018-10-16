import { URL } from "url";

import builder from "content-security-policy-builder";
import { extractParentsHostname } from "talk-server/app/url";
import { Tenant } from "talk-server/models/tenant";
import { Request, RequestHandler } from "talk-server/types/express";

/**
 * cspMiddleware handles adding the CSP middleware to each outgoing request.
 */
export const cspTenantMiddleware: RequestHandler = (req, res, next) => {
  const tenant = req.talk!.tenant;
  if (!tenant) {
    // There is no tenant for the request, don't add any headers.
    return next();
  }

  res.setHeader(
    "Content-Security-Policy",
    generateContentSecurityPolicy(req, tenant)
  );

  // Add some fallbacks for IE.
  res.setHeader("X-Frame-Options", generateFrameOptions(req, tenant));
  res.setHeader("X-XSS-Protection", "1; mode=block");

  next();
};

function generateContentSecurityPolicy(req: Request, tenant: Tenant) {
  const directives: Record<string, any> = {};

  // Only the domains that are allowed by the tenant may embed Talk.
  directives.frameAncestors =
    tenant.domains.length > 0 ? tenant.domains : ["'none'"];

  // Build the directive.
  const directive = builder({ directives });

  return directive;
}

function generateFrameOptions(req: Request, tenant: Tenant) {
  // If there aren't any domains, then we reject it.
  if (tenant.domains.length === 0) {
    return "deny";
  }

  // Grab the parent's hostname.
  const parentsHostname = extractParentsHostname(req);
  if (!parentsHostname) {
    return "deny";
  }

  // As we can only return a single domain in the `allow-from` directive as per
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  // We need to find the domain that is asking so we can respond with the right
  // result, sort of like CORS!
  const allowFrom = tenant.domains.find(
    domain => new URL(domain).hostname === parentsHostname
  );
  if (!allowFrom) {
    return "deny";
  }

  return `allow-from ${allowFrom}`;
}
