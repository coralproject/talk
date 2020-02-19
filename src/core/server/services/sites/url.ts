import {
  doesRequireSchemePrefixing,
  getOrigin,
  isURLSecure,
  prefixSchemeIfRequired,
} from "coral-server/app/url";
import { Site } from "coral-server/models/site";

export function isURLPermitted(
  site: Pick<Site, "allowedOrigins">,
  targetURL: string,
  includeTenantDomain?: false
): boolean;

export function isURLPermitted(
  site: Pick<Site, "allowedOrigins">,
  targetURL: string,
  includeTenantDomain: true
): boolean;

/**
 * isURLInsideAllowedDomains will validate if the given origin is allowed given
 * the Tenant's domain configuration.
 */
export function isURLPermitted(
  site: Pick<Site, "allowedOrigins">,
  targetURL: string,
  includeTenantDomain = false
) {
  // If there aren't any domains, then we reject it, because no url we have can
  // satisfy those requirements.
  if (site.allowedOrigins.length === 0 && !includeTenantDomain) {
    return false;
  }

  // If the scheme can not be inferred, then we can't determine the
  // admissability of the url.
  if (doesRequireSchemePrefixing(targetURL)) {
    return false;
  }

  // Determine the scheme of the targetOrigin. We know that the targetURL does
  // not need prefixing, so it can only be true/false here.
  const originSecure = isURLSecure(targetURL) as boolean;

  // Extract the origin from the URL.
  const targetOrigin = getOrigin(targetURL);

  // Create the list of domains to check against.
  const domains = site.allowedOrigins;

  // Loop over all the Tenant domains provided. Prefix the domain of each if it
  // is required with the target url scheme. Return if at least one match is
  // found within the Tenant domains.
  return domains
    .map(domain => getOrigin(prefixSchemeIfRequired(originSecure, domain)))
    .some(origin => origin === targetOrigin);
}
