import { Db } from "mongodb";

import {
  doesRequireSchemePrefixing,
  getOrigin,
  isURLSecure,
  prefixSchemeIfRequired,
} from "talk-server/app/url";
import logger from "talk-server/logger";
import {
  createStory,
  CreateStoryInput,
  findOrCreateStory,
  FindOrCreateStoryInput,
  removeStory,
} from "talk-server/models/story";
import { Tenant } from "talk-server/models/tenant";
import Task from "talk-server/queue/Task";
import { ScraperData } from "talk-server/queue/tasks/scraper";
import { scrape } from "talk-server/services/stories/scraper";

export type FindOrCreateStory = FindOrCreateStoryInput;

export async function findOrCreate(
  db: Db,
  tenant: Tenant,
  input: FindOrCreateStory,
  scraper: Task<ScraperData>
) {
  // If the URL is provided, and the url is not on a allowed domain, then refuse
  // to create the Asset.
  if (input.url && !isURLPermitted(tenant, input.url)) {
    logger.warn(
      { storyURL: input.url, tenantDomains: tenant.domains },
      "provided story url was not in the list of permitted tenant domains, story not found"
    );
    return null;
  }

  // TODO: check to see if the tenant has enabled lazy story creation, if they haven't, switch to find only.

  const story = await findOrCreateStory(db, tenant.id, input);
  if (!story) {
    return null;
  }

  // TODO: check to see if the tenant has scraping enabled.

  if (!story.metadata && !story.scrapedAt) {
    // If the scraper has not scraped this story, and we have no metadata, we
    // need to scrape it now!
    await scraper.add({
      storyID: story.id,
      storyURL: story.url,
      tenantID: tenant.id,
    });
  }

  return story;
}

/**
 * isURLInsideAllowedDomains will validate if the given origin is allowed given
 * the Tenant's domain configuration.
 */
export function isURLPermitted(
  tenant: Pick<Tenant, "domains">,
  targetURL: string
) {
  // If there aren't any domains, then we reject it, because no url we have can
  // satisfy those requirements.
  if (tenant.domains.length === 0) {
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

  // Loop over all the Tenant domains provided. Prefix the domain of each if it
  // is required with the target url scheme. Return if at least one match is
  // found within the Tenant domains.
  return tenant.domains
    .map(domain => getOrigin(prefixSchemeIfRequired(originSecure, domain)))
    .some(origin => origin === targetOrigin);
}

export function remove(
  mongo: Db,
  tenant: Tenant,
  storyID: string,
  includeComments: boolean = false
) {
  if (includeComments) {
    // FIXME: delete comments
  } else {
    // FIXME: find if there are comments for this story, if there are, error out
  }

  return removeStory(mongo, tenant.id, storyID);
}

export type CreateStory = CreateStoryInput;

export async function create(mongo: Db, tenant: Tenant, input: CreateStory) {
  // Ensure that the given URL is allowed.
  if (!isURLPermitted(tenant, input.url)) {
    logger.warn(
      { storyURL: input.url, tenantDomains: tenant.domains },
      "provided story url was not in the list of permitted tenant domains, story not created"
    );
    return null;
  }

  // Create the story in the database.
  let newStory = await createStory(mongo, tenant.id, input);
  if (!input.metadata && !newStory.scrapedAt) {
    // If the scraper has not scraped this story and story metadata was not
    // provided, we need to scrape it now!
    newStory = await scrape(mongo, tenant.id, newStory.id);
  }

  return newStory;
}
