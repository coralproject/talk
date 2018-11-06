import builder from "content-security-policy-builder";
import {
  doesRequireSchemePrefixing,
  extractParentsURL,
  getOrigin,
  isURLSecure,
  prefixSchemeIfRequired,
} from "talk-server/app/url";
import { Tenant } from "talk-server/models/tenant";
import { isURLPermitted } from "talk-server/services/stories";
import { Request, RequestHandler } from "talk-server/types/express";

/**
 * cspMiddleware handles adding the CSP middleware to each outgoing request.
 */
export const cspTenantMiddleware: RequestHandler = (req, res, next) => {
  if (!req.talk || !req.talk.tenant) {
    // There is no tenant for the request, don't add any headers.
    return next();
  }

  const tenant = req.talk.tenant;

  res.setHeader(
    "Content-Security-Policy",
    generateContentSecurityPolicy(req, tenant)
  );

  // Add some fallbacks for IE.
  res.setHeader("X-Frame-Options", generateFrameOptions(req, tenant));
  res.setHeader("X-XSS-Protection", "1; mode=block");

  next();
};

function generateContentSecurityPolicy(
  req: Request,
  tenant: Pick<Tenant, "domains">
) {
  const directives: Record<string, any> = {};

  // Only the domains that are allowed by the tenant may embed Talk.
  directives.frameAncestors =
    tenant.domains.length > 0 ? tenant.domains : ["'none'"];

  // Build the directive.
  const directive = builder({ directives });

  return directive;
}

export function generateFrameOptions(
  req: Request,
  tenant: Pick<Tenant, "domains">
) {
  // If there aren't any domains, then we reject it.
  if (tenant.domains.length === 0) {
    return "deny";
  }

  // If there is only one domain on the tenant, and we don't require
  // prefixing, then return it!
  if (
    tenant.domains.length === 1 &&
    !doesRequireSchemePrefixing(tenant.domains[0])
  ) {
    return `allow-from ${getOrigin(tenant.domains[0])}`;
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

  // Grab the status if the parent url is secure.
  const parentSecure = isURLSecure(parentsOrigin);
  if (parentSecure === null) {
    return "deny";
  }

  // If there is only one domain on the tenant, and we require prefixing, then
  // return it with prefixing!
  if (
    tenant.domains.length === 1 &&
    !doesRequireSchemePrefixing(tenant.domains[0])
  ) {
    return `allow-from ${getOrigin(
      prefixSchemeIfRequired(parentSecure, tenant.domains[0])
    )}`;
  }

  // Determine if this origin is allowed.
  if (!isURLPermitted(tenant, parentsURL)) {
    return "deny";
  }

  // As we can only return a single domain in the `allow-from` directive as per
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  // We need to find the domain that is asking so we can respond with the right
  // result, sort of like CORS!
  const allowFrom = tenant.domains
    .map(domain => getOrigin(prefixSchemeIfRequired(parentSecure, domain)))
    .find(origin => origin === parentsOrigin);
  if (!allowFrom) {
    return "deny";
  }

  return `allow-from ${allowFrom}`;
}
