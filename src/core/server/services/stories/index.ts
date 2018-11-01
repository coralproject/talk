import { Db } from "mongodb";

import {
  doesRequireSchemePrefixing,
  getOrigin,
  isURLSecure,
  prefixSchemeIfRequired,
} from "talk-server/app/url";
import logger from "talk-server/logger";
import { removeRootActions } from "talk-server/models/action";
import { removeStoryComments } from "talk-server/models/comment";
import {
  calculateTotalCommentCount,
  createStory,
  CreateStoryInput,
  findOrCreateStory,
  FindOrCreateStoryInput,
  removeStory,
  retrieveStory,
  updateStory,
  UpdateStoryInput,
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
      { story_url: input.url, tenant_domains: tenant.domains },
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

export async function remove(
  mongo: Db,
  tenant: Tenant,
  storyID: string,
  includeComments: boolean = false
) {
  // Create a logger for this function.
  const log = logger.child({
    story_id: storyID,
    include_comments: includeComments,
  });

  // Get the story so we can see if there are associated comments.
  const story = await retrieveStory(mongo, tenant.id, storyID);
  if (!story) {
    // No story was found!
    log.warn("attempted to delete story that wasn't found");
    return null;
  }

  if (includeComments) {
    let deletedCount: number | undefined;

    // Remove the actions associated with the comments we just removed.
    ({ deletedCount } = await removeRootActions(mongo, tenant.id, story.id));

    log.debug(
      { deleted_actions: deletedCount },
      "deleted actions while deleting story"
    );

    // Remove the comments for the story.
    ({ deletedCount } = await removeStoryComments(mongo, tenant.id, story.id));

    log.debug(
      { deleted_comments: deletedCount },
      "deleted comments while deleting story"
    );
  } else if (calculateTotalCommentCount(story.comment_counts) > 0) {
    log.warn(
      "attempted to delete story that has linked comments without consent for deleting comments"
    );

    // TODO: (wyattjoh) improve error
    throw new Error("asset has comments, cannot delete");
  }

  const deletedStory = await removeStory(mongo, tenant.id, story.id);
  if (!deletedStory) {
    // Story was already deleted.
    // TODO: evaluate use of transaction here.
    return null;
  }

  log.debug("deleted story");

  return deletedStory;
}

export type CreateStory = CreateStoryInput;

export async function create(mongo: Db, tenant: Tenant, input: CreateStory) {
  // Ensure that the given URL is allowed.
  if (!isURLPermitted(tenant, input.url)) {
    logger.warn(
      { story_url: input.url, tenant_domains: tenant.domains },
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

export type UpdateStory = UpdateStoryInput;

export async function update(
  mongo: Db,
  tenant: Tenant,
  storyID: string,
  input: UpdateStory
) {
  // Ensure that the given URL is allowed.
  if (input.url && !isURLPermitted(tenant, input.url)) {
    logger.warn(
      { story_url: input.url, tenant_domains: tenant.domains },
      "provided story url was not in the list of permitted tenant domains, story not updated"
    );
    return null;
  }

  return updateStory(mongo, tenant.id, storyID, input);
}
