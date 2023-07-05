import { v1 as uuid } from "uuid";

import { MongoContext } from "coral-server/data/context";
import { TenantNotFoundError } from "coral-server/errors";
import logger from "coral-server/logger";
import {
  retrieveSite,
  retrieveSiteByOrigin,
  Site,
} from "coral-server/models/site";
import { retrieveStory } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { findSiteByURL } from "coral-server/services/sites";
import { TenantCache } from "coral-server/services/tenant/cache";
import { Request, RequestHandler } from "coral-server/types/express";

import { getRequesterOrigin } from "../helpers";

interface RequestQuery {
  storyURL?: string | null;
  storyID?: string | null;
  siteID?: string | null;
}

/**
 * parseQueryFromRequest will parse the query from the request, either from the
 * actual query on the url, or the referer header if made on a trusted origin.
 *
 * @param tenant the tenant associated with this request
 * @param req the request in question
 */
function parseQueryFromRequest(
  tenant: Tenant,
  req: Request
): RequestQuery | null {
  // Check to see if the parameters are available on the query. If they are,
  // return it.
  if (req.query.storyURL || req.query.storyID || req.query.siteID) {
    return req.query;
  }

  // Looks like the parameters aren't available on the query, does this request
  // have a referer header?
  const { referer } = req.headers;
  if (!referer) {
    return null;
  }

  // Check to see if the referer is an embed link. If it is, we can infer the
  // details there. We should do this by parsing the referer.
  let parsed: URL;
  try {
    parsed = new URL(referer);
  } catch {
    return null;
  }

  // Ensure that the referer hostname.
  if (parsed.hostname !== tenant.domain) {
    return null;
  }

  // Ensure that the parsed path name is the embed stream.
  if (parsed.pathname !== "/embed/stream") {
    return null;
  }

  // Ensure we have some parameters in the query string.
  if (!parsed.search) {
    return null;
  }

  // Reconstruct the query by getting all the parts.
  const query: RequestQuery = {
    siteID: parsed.searchParams.get("siteID"),
    storyURL: parsed.searchParams.get("storyURL"),
    storyID: parsed.searchParams.get("storyID"),
  };

  return query;
}

/**
 * retrieveSiteFromQuery will get the site from the passed query.
 *
 * @param mongo the database connection
 * @param tenant the tenant associated with this request
 * @param query the query that was parsed for this request
 */
async function retrieveSiteFromQuery(
  mongo: MongoContext,
  tenant: Tenant,
  { storyURL, storyID, siteID }: RequestQuery
): Promise<Site | null> {
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

/**
 * retrieveSiteFromRequest will retrieve the site from the request in question.
 *
 * @param mongo the database connection
 * @param tenant the tenant associated with this request
 * @param req the request in question
 */
async function retrieveSiteFromRequest(
  mongo: MongoContext,
  tenant: Tenant,
  req: Request
): Promise<Site | null> {
  let site: Site | null = null;
  const query = parseQueryFromRequest(tenant, req);
  if (query) {
    logger.debug({ query }, "parsed query from request");
    site = await retrieveSiteFromQuery(mongo, tenant, query);
  }
  if (!site) {
    const requesterOrigin = getRequesterOrigin(req);
    // We use the requester's origin, if the site cannot be found from the query.
    if (requesterOrigin) {
      site = await retrieveSiteByOrigin(mongo, tenant.id, requesterOrigin);
    }
  }
  if (site) {
    logger.debug({ siteID: site.id }, "found associated site from request");
  }

  return site;
}

interface Options {
  mongo: MongoContext;
  cache: TenantCache;
  passNoTenant?: boolean;
}

export const tenantMiddleware =
  ({ mongo, cache, passNoTenant = false }: Options): RequestHandler =>
  async (req, res, next) => {
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
        const site = await retrieveSiteFromRequest(mongo, tenant, req);
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
