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

export function extractParentsURL(req: Pick<Request, "headers" | "query">) {
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
    return req.query.parentUrl;
  }

  return null;
}

/**
 * extractParentsOrigin will pull the parent's origin out.
 *
 * @param req the request where we want to extract the parent's hostname from.
 */
export function extractParentsOrigin(req: Pick<Request, "headers" | "query">) {
  const url = extractParentsURL(req);
  if (!url) {
    return null;
  }

  return getOrigin(url);
}
