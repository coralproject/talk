import { createCacheUrl } from "@ampproject/toolbox-cache-url";
import builder from "content-security-policy-builder";
import { compact, flatten } from "lodash";

import { AppOptions } from "coral-server/app";
import { getOrigin, prefixSchemeIfRequired } from "coral-server/app/url";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import {
  retrieveSite,
  retrieveSiteByOrigin,
  Site,
} from "coral-server/models/site";
import { retrieveStory } from "coral-server/models/story";
import { isAMPEnabled, Tenant } from "coral-server/models/tenant";
import { findSiteByURL } from "coral-server/services/sites";
import { Request, RequestHandler } from "coral-server/types/express";

interface RequestQuery {
  storyURL?: string;
  storyID?: string;
  siteID?: string;
}

async function retrieveSiteFromQuery(
  mongo: MongoContext,
  req: Request,
  tenant: Tenant
): Promise<Site | null> {
  // Attempt to detect the site based on the query parameters.
  const { storyURL = "", storyID = "", siteID = "" }: RequestQuery = req.query;

  // If the siteID is available, use that.
  if (siteID) {
    return retrieveSite(mongo, tenant.id, siteID);
  }

  // If the storyURL is available, we can lookup the site directly based on it.
  if (storyURL) {
    // If the site can't be found based on it's allowed origins and the story
    // URL (which is a allowed list), then we know it isn't allowed.
    return findSiteByURL(mongo, tenant.id, storyURL);
  }

  // If the storyID is available, we can lookup the story and then it's site.
  if (storyID) {
    const story = await retrieveStory(mongo, tenant.id, storyID);
    if (!story) {
      // We can't lookup the story, therefore we can't lookup the site, abort.
      return null;
    }

    // If the site can't be found based on it's allowed origins and the story
    // URL (which is a allowed list), then we know it isn't allowed.
    return retrieveSite(mongo, tenant.id, story.siteID);
  }

  return null;
}

async function retrieveAMPOrigins(
  config: Config,
  origins: string[]
): Promise<string[]> {
  const cacheDomains = config.get("amp_cache_domains");

  // For each of the cache domains, we have to generate the amp equivalent.
  const urls = await Promise.all(
    cacheDomains.map((cacheDomain) =>
      Promise.all(origins.map((origin) => createCacheUrl(cacheDomain, origin)))
    )
  );

  return compact(flatten(urls).map((url) => getOrigin(url)));
}

async function retrieveOriginsFromRequest(
  mongo: MongoContext,
  config: Config,
  req: Request
): Promise<string[]> {
  const { tenant } = req.coral;
  if (!tenant) {
    return [];
  }

  let site = await retrieveSiteFromQuery(mongo, req, tenant);
  if (!site) {
    const requesterOrigin = getRequesterOrigin(req);
    // We use the requester's origin, if the site cannot be found from the query.
    if (requesterOrigin) {
      site = await retrieveSiteByOrigin(mongo, tenant.id, requesterOrigin);
    }
  }

  if (!site || site.allowedOrigins.length === 0) {
    return [];
  }

  const origins = site.allowedOrigins;

  if (isAMPEnabled(tenant)) {
    const amp = await retrieveAMPOrigins(config, origins);
    origins.push(...amp);
  }

  return origins;
}

/**
 * getRequesterOrigin will get the origin of the requester from the request.
 *
 * @param req the request to get the origin from
 */
function getRequesterOrigin(req: Request): string | null {
  const { referer } = req.headers;
  if (!referer) {
    return null;
  }

  return getOrigin(referer);
}

type Options = Pick<AppOptions, "mongo" | "config"> & {
  /**
   * frameAncestorsDeny when true will prevent the request's page from being
   * embedded on any page inside an iframe.
   */
  frameAncestorsDeny?: true;
};

/**
 * cspMiddleware handles adding the CSP middleware to each outgoing request.
 */
export const cspSiteMiddleware =
  ({ mongo, config, frameAncestorsDeny }: Options): RequestHandler =>
  async (req, res, next) => {
    const {
      coral: { tenant },
    } = req;

    // if we have a tenant (should come through on all admin pages)
    // then we can pull our domain for admin handlers and set it in
    // our CSP headers.
    const domains: string[] = [];
    if (tenant) {
      const domain =
        config.get("env") === "development"
          ? `http://${tenant.domain}:${config.get("port")}`
          : tenant.domain;
      domains.push(domain);
    }

    // If the frame ancestors is being set to deny (admin pages), then
    // use our domains, otherwise look it up from the request (stream).
    const origins = frameAncestorsDeny
      ? domains
      : await retrieveOriginsFromRequest(mongo, config, req);

    const frameOptions = generateFrameOptions(req, origins);
    if (frameOptions) {
      res.setHeader("X-Frame-Options", frameOptions);
    }

    // If we have AMP enabled, then we cannot send frame-ancestors because we
    // can't predict the top level ancestor!
    if (req.coral.tenant && isAMPEnabled(req.coral.tenant)) {
      return next();
    }

    res.setHeader(
      "Content-Security-Policy",
      generateContentSecurityPolicy(origins)
    );

    return next();
  };

function generateContentSecurityPolicy(allowedOrigins: string[]) {
  // Only the domains that are allowed by the tenant may embed Coral.
  const frameAncestors =
    allowedOrigins.length > 0 ? ["'self'", ...allowedOrigins] : ["'none'"];

  // Build and return the directive.
  return builder({ directives: { frameAncestors } });
}

export function generateFrameOptions(
  req: Request,
  allowedOrigins: string[]
): string | null {
  // If there aren't any allowed origins, then we reject it!
  if (allowedOrigins.length === 0) {
    return "deny";
  }

  // Try to get the requester origin. If we can't get it, then block the iframe
  // from appearing. This requires that the referer is always passed.
  const requesterOrigin = getRequesterOrigin(req);
  if (!requesterOrigin) {
    return "deny";
  }

  // If the requester origin is the tenant origin, then allow it! Note that for
  // development, the port is not included in the origin, but localhost isn't
  // used in production so this shouldn't be an issue!
  if (
    req.coral?.tenant &&
    requesterOrigin ===
      prefixSchemeIfRequired(req.secure, req.coral.tenant.domain).toLowerCase()
  ) {
    return null;
  }

  if (!allowedOrigins.includes(requesterOrigin)) {
    // If the requester origin does not exist in the allowed origins, then don't
    // do anything!
    return "deny";
  }

  // Returning null signals that we're not applying any `X-Frame-Options` to
  // this request (the same as allowing it).
  return null;
}
