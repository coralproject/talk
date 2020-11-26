import builder from "content-security-policy-builder";
import { Db } from "mongodb";

import { AppOptions } from "coral-server/app";
import { extractParentsURL, getOrigin } from "coral-server/app/url";
import { retrieveSite, Site } from "coral-server/models/site";
import { retrieveStory } from "coral-server/models/story";
import { hasFeatureFlag } from "coral-server/models/tenant";
import { findSiteByURL } from "coral-server/services/sites";
import { isURLPermitted } from "coral-server/services/sites/url";
import { Request, RequestHandler } from "coral-server/types/express";

import { GQLFEATURE_FLAG } from "coral-server/graph/schema/__generated__/types";

interface RequestQuery {
  parentUrl?: string;
  storyURL?: string;
  storyID?: string;
  siteID?: string;
}

async function retrieveSiteFromEmbed(
  mongo: Db,
  req: Request
): Promise<Site | null> {
  const { tenant } = req.coral;
  if (!tenant) {
    // There is no tenant for the request, don't add any headers.
    return null;
  }

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

async function retrieveOriginsFromRequest(
  mongo: Db,
  req: Request
): Promise<string[]> {
  const site = await retrieveSiteFromEmbed(mongo, req);
  if (!site) {
    return [];
  }

  return site.allowedOrigins;
}

type Options = Pick<AppOptions, "mongo"> & {
  /**
   * frameAncestorsDeny when true will prevent the request's page from being
   * embedded on any page inside an iframe.
   */
  frameAncestorsDeny?: true;
};

/**
 * cspMiddleware handles adding the CSP middleware to each outgoing request.
 */
export const cspSiteMiddleware = ({
  mongo,
  frameAncestorsDeny,
}: Options): RequestHandler => async (req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // If the frame ancestors isn't being forced, and the tenant has AMP enabled,
  // then don't add any headers!
  if (
    !frameAncestorsDeny &&
    req.coral.tenant &&
    hasFeatureFlag(req.coral.tenant, GQLFEATURE_FLAG.ENABLE_AMP)
  ) {
    return next();
  }

  // If the frame ancestors is being set to deny, then use an empty list,
  // otherwise look it up from the request.
  const origins = frameAncestorsDeny
    ? []
    : await retrieveOriginsFromRequest(mongo, req);

  res.setHeader(
    "Content-Security-Policy",
    generateContentSecurityPolicy(origins)
  );
  res.setHeader("X-Frame-Options", generateFrameOptions(req, origins));

  next();
};

function generateContentSecurityPolicy(allowedOrigins: string[]) {
  // Only the domains that are allowed by the tenant may embed Coral.
  const frameAncestors =
    allowedOrigins.length > 0 ? ["'self'", ...allowedOrigins] : ["'none'"];

  // Build and return the directive.
  return builder({ directives: { frameAncestors } });
}

export function generateFrameOptions(req: Request, allowedOrigins: string[]) {
  // If there aren't any domains, then we reject it.
  if (allowedOrigins.length === 0) {
    return "deny";
  }

  // If there is only one domain on the tenant then return it!
  if (allowedOrigins.length === 1) {
    return `allow-from ${getOrigin(allowedOrigins[0])}`;
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
  if (!isURLPermitted({ allowedOrigins }, parentsURL)) {
    return "deny";
  }

  // As we can only return a single domain in the `allow-from` directive as per
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  // We need to find the domain that is asking so we can respond with the right
  // result, sort of like CORS!
  const allowFrom = allowedOrigins
    .map((domain) => getOrigin(domain))
    .find((origin) => origin === parentsOrigin);
  if (!allowFrom) {
    return "deny";
  }

  return `allow-from ${allowFrom}`;
}
