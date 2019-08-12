import builder from "content-security-policy-builder";
import { extractParentsURL, getOrigin } from "coral-server/app/url";
import { Tenant } from "coral-server/models/tenant";
import { isURLPermitted } from "coral-server/services/tenant/url";
import { Request, RequestHandler } from "coral-server/types/express";

/**
 * cspMiddleware handles adding the CSP middleware to each outgoing request.
 */
export const cspTenantMiddleware: RequestHandler = (req, res, next) => {
  if (!req.coral || !req.coral.tenant) {
    // There is no tenant for the request, don't add any headers.
    return next();
  }

  const tenant = req.coral.tenant;

  res.setHeader(
    "Content-Security-Policy",
    generateContentSecurityPolicy(tenant)
  );

  // Add some fallbacks for IE.
  res.setHeader("X-Frame-Options", generateFrameOptions(req, tenant));
  res.setHeader("X-XSS-Protection", "1; mode=block");

  next();
};

function generateContentSecurityPolicy(tenant: Pick<Tenant, "allowedDomains">) {
  const directives: Record<string, any> = {};

  // Only the domains that are allowed by the tenant may embed Coral.
  directives.frameAncestors =
    tenant.allowedDomains.length > 0 ? tenant.allowedDomains : ["'none'"];

  // Build the directive.
  const directive = builder({ directives });

  return directive;
}

export function generateFrameOptions(
  req: Request,
  tenant: Pick<Tenant, "allowedDomains">
) {
  // If there aren't any domains, then we reject it.
  if (tenant.allowedDomains.length === 0) {
    return "deny";
  }

  // If there is only one domain on the tenant then return it!
  if (tenant.allowedDomains.length === 1) {
    return `allow-from ${getOrigin(tenant.allowedDomains[0])}`;
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
  if (!isURLPermitted(tenant, parentsURL)) {
    return "deny";
  }

  // As we can only return a single domain in the `allow-from` directive as per
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  // We need to find the domain that is asking so we can respond with the right
  // result, sort of like CORS!
  const allowFrom = tenant.allowedDomains
    .map(domain => getOrigin(domain))
    .find(origin => origin === parentsOrigin);
  if (!allowFrom) {
    return "deny";
  }

  return `allow-from ${allowFrom}`;
}
