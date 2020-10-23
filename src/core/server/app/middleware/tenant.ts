import { Db } from "mongodb";
import { v1 as uuid } from "uuid";

import { TenantNotFoundError } from "coral-server/errors";
import logger from "coral-server/logger";
import { retrieveSite, Site } from "coral-server/models/site";
import { retrieveStory } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { findSiteByURL } from "coral-server/services/sites";
import { TenantCache } from "coral-server/services/tenant/cache";
import { Request, RequestHandler } from "coral-server/types/express";

interface RequestQuery {
  parentUrl?: string;
  storyURL?: string;
  storyID?: string;
  siteID?: string;
}

async function retrieveSiteFromEmbed(
  mongo: Db,
  tenant: Tenant,
  req: Request
): Promise<Site | null> {
  // Attempt to detect the site based on the query parameters.
  const {
    storyURL = "",
    storyID = "",
    parentUrl = "",
    siteID = "",
  }: RequestQuery = req.query;

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

  // As the last fallback, if the storyURL and storyID cannot be found, then pym
  // does provide us with a parentUrl that's the URL of the page embedding
  // Coral. We'll try to find the site based on this URL.
  if (parentUrl) {
    return findSiteByURL(mongo, tenant.id, parentUrl);
  }

  return null;
}

interface Options {
  mongo: Db;
  cache: TenantCache;
  passNoTenant?: boolean;
}

export const tenantMiddleware = ({
  mongo,
  cache,
  passNoTenant = false,
}: Options): RequestHandler => async (req, res, next) => {
  try {
    if (!req.coral) {
      const id = uuid();

      // Write the ID on the request.
      res.set("X-Trace-ID", id);

      // The only call to `new Date()` as a part of the request process. This
      // is passed around the request to ensure constant-time actions.
      const now = new Date();

      // Set Coral on the request.
      req.coral = {
        id,
        now,
        cache: {
          // Attach the tenant cache to the request.
          tenant: cache,
        },
        logger: logger.child({ context: "http", contextID: id }, true),
      };
    }

    // Attach the tenant to the request.
    const tenant = await cache.retrieveByDomain(req.hostname);
    if (!tenant) {
      if (passNoTenant) {
        return next();
      }

      return next(new TenantNotFoundError(req.hostname));
    }

    // Get the site associated with this request if it has a Tenant.
    if (tenant) {
      const site = await retrieveSiteFromEmbed(mongo, tenant, req);
      if (site) {
        req.coral.site = site;
      }
    }

    // Augment the logger with the tenantID.
    req.coral.logger = req.coral.logger.child({ tenantID: tenant.id }, true);

    // Attach the tenant to the request.
    req.coral.tenant = tenant;

    // Attach the tenant's language to the request.
    res.setHeader("Content-Language", tenant.locale);

    // Attach the tenant to the view locals.
    res.locals.tenant = tenant;

    next();
  } catch (err) {
    next(err);
  }
};
