import { URL } from "url";

import { Config } from "coral-server/config";
import { Tenant } from "coral-server/models/tenant";
import { Request } from "coral-server/types/express";

export function reconstructURL(req: Request, path = "/"): string {
  const scheme = req.secure ? "https" : "http";
  const host = req.get("host");
  const base = `${scheme}://${host}`;

  const url = new URL(path, base);

  return url.href;
}

/**
 * constructTenantURL will construct a URL based off of the Tenant's domain.
 */
export function constructTenantURL(
  config: Config,
  tenant: Pick<Tenant, "domain">,
  path = "/"
): string {
  let url: URL = new URL(path, `https://${tenant.domain}`);
  if (config.get("env") === "development") {
    url = new URL(path, `http://${tenant.domain}:${config.get("dev_port")}`);
  }

  return url.href;
}

export function reconstructTenantURL(
  config: Config,
  tenant: Pick<Tenant, "domain">,
  req?: Request,
  path = "/"
) {
  // If the request is available, then prefer it over building from the tenant
  // as the tenant does not include the port number. This should only really
  // be a problem if the graph API is called internally.
  if (req) {
    return reconstructURL(req, path);
  }

  // Note that when constructing the callback url with the tenant, the port
  // information is lost.
  return constructTenantURL(config, tenant, path);
}

/**
 * constructDownloadLinkURL will construct a URL based off of either a domain
 * override set by the download_gdpr_comments_link_domain env var or default to
 * the Tenant's domain.
 */
export function constructDownloadLinkURL(
  config: Config,
  tenant: Pick<Tenant, "domain">,
  path = "/",
  downloadLinkDomainOverride: string
): string {
  const linkDomain =
    downloadLinkDomainOverride !== ""
      ? downloadLinkDomainOverride
      : tenant.domain;
  let url: URL = new URL(path, `https://${linkDomain}`);
  if (config.get("env") === "development") {
    url = new URL(path, `http://${linkDomain}:${config.get("dev_port")}`);
  }

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
    return new URL(url).origin.toLowerCase();
  } catch (err) {
    return null;
  }
}

export function prefixSchemeIfRequired(secure: boolean, url: string) {
  if (doesRequireSchemePrefixing(url)) {
    return (
      "http" + (secure ? "s" : "") + (!url.includes("//") ? "://" : ":") + url
    );
  }

  return url;
}
