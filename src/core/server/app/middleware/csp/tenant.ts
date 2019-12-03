import builder from "content-security-policy-builder";
import { Db } from "mongodb";

import { extractParentsURL, getOrigin } from "coral-server/app/url";
import { retrieveSite, Site } from "coral-server/models/site";
import { isURLPermitted } from "coral-server/services/tenant/url";
import { Request, RequestHandler } from "coral-server/types/express";

export interface MiddlewareOptions {
  mongo: Db;
}
/**
 * cspMiddleware handles adding the CSP middleware to each outgoing request.
 */
export const cspTenantMiddleware = ({
  mongo,
}: MiddlewareOptions): RequestHandler => async (req, res, next) => {
  if (!req.coral || !req.coral.tenant) {
    // There is no tenant for the request, don't add any headers.
    return next();
  }

  const tenant = req.coral.tenant;

  const site = await retrieveSite(mongo, tenant.id, req.query.siteID);

  if (!site) {
    // TODO: deal with this
    next();
  } else {
    res.setHeader(
      "Content-Security-Policy",
      generateContentSecurityPolicy(site)
    );

    // Add some fallbacks for IE.
    res.setHeader("X-Frame-Options", generateFrameOptions(req, site));
    res.setHeader("X-XSS-Protection", "1; mode=block");

    next();
  }
};

function generateContentSecurityPolicy(site: Pick<Site, "domains">) {
  const directives: Record<string, any> = {};

  // Only the domains that are allowed by the tenant may embed Coral.
  directives.frameAncestors =
    site.domains.length > 0 ? site.domains : ["'none'"];

  // Build the directive.
  const directive = builder({ directives });

  return directive;
}

export function generateFrameOptions(
  req: Request,
  site: Pick<Site, "domains">
) {
  // If there aren't any domains, then we reject it.
  if (site.domains.length === 0) {
    return "deny";
  }

  // If there is only one domain on the tenant then return it!
  if (site.domains.length === 1) {
    return `allow-from ${getOrigin(site.domains[0])}`;
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
  if (!isURLPermitted(site, parentsURL)) {
    return "deny";
  }

  // As we can only return a single domain in the `allow-from` directive as per
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  // We need to find the domain that is asking so we can respond with the right
  // result, sort of like CORS!
  const allowFrom = site.domains
    .map(domain => getOrigin(domain))
    .find(origin => origin === parentsOrigin);
  if (!allowFrom) {
    return "deny";
  }

  return `allow-from ${allowFrom}`;
}
