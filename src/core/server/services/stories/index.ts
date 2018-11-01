import { zip } from "lodash";
import { Db } from "mongodb";

import {
  doesRequireSchemePrefixing,
  getOrigin,
  isURLSecure,
  prefixSchemeIfRequired,
} from "talk-server/app/url";
import logger from "talk-server/logger";
import {
  mergeManyRootActions,
  removeRootActions,
} from "talk-server/models/action";
import {
  mergeManyCommentStories,
  removeStoryComments,
} from "talk-server/models/comment";
import {
  calculateTotalCommentCount,
  createStory,
  CreateStoryInput,
  findOrCreateStory,
  FindOrCreateStoryInput,
  mergeCommentStatusCount,
  removeStories,
  removeStory,
  retrieveManyStories,
  retrieveStory,
  Story,
  updateCommentStatusCount,
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

  log.debug("starting to remove story");

  // Get the story so we can see if there are associated comments.
  const story = await retrieveStory(mongo, tenant.id, storyID);
  if (!story) {
    // No story was found!
    log.warn("attempted to remove story that wasn't found");
    return null;
  }

  if (includeComments) {
    let removedCount: number | undefined;

    // Remove the actions associated with the comments we just removed.
    ({ deletedCount: removedCount } = await removeRootActions(
      mongo,
      tenant.id,
      story.id
    ));

    log.debug(
      { removed_actions: removedCount },
      "removed actions while deleting story"
    );

    // Remove the comments for the story.
    ({ deletedCount: removedCount } = await removeStoryComments(
      mongo,
      tenant.id,
      story.id
    ));

    log.debug(
      { removed_comments: removedCount },
      "removed comments while deleting story"
    );
  } else if (calculateTotalCommentCount(story.comment_counts) > 0) {
    log.warn(
      "attempted to remove story that has linked comments without consent for deleting comments"
    );

    // TODO: (wyattjoh) improve error
    throw new Error("asset has comments, cannot remove");
  }

  const removedStory = await removeStory(mongo, tenant.id, story.id);
  if (!removedStory) {
    // Story was already removed.
    // TODO: evaluate use of transaction here.
    return null;
  }

  log.debug("removed story");

  return removedStory;
}

export type CreateStory = CreateStoryInput;

export async function create(
  mongo: Db,
  tenant: Tenant,
  storyID: string,
  storyURL: string,
  input: CreateStory
) {
  // Ensure that the given URL is allowed.
  if (!isURLPermitted(tenant, storyURL)) {
    logger.warn(
      { story_url: storyURL, tenant_domains: tenant.domains },
      "provided story url was not in the list of permitted tenant domains, story not created"
    );
    return null;
  }

  // Create the story in the database.
  let newStory = await createStory(mongo, tenant.id, storyID, storyURL, input);
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

export async function merge(
  mongo: Db,
  tenant: Tenant,
  destinationID: string,
  sourceIDs: string[]
) {
  // Create a logger for this operation.
  const log = logger.child({
    destination_id: destinationID,
    source_ids: sourceIDs,
  });

  if (sourceIDs.length === 0) {
    log.warn("cannot merge from 0 stories");
    return null;
  }

  // Get the stories referenced.
  const storyIDs = [destinationID, ...sourceIDs];
  const stories = await retrieveManyStories(mongo, tenant.id, storyIDs);

  // Ensure that these are all defined.
  if (
    zip(storyIDs, stories).some(([storyID, story]) => {
      if (!story) {
        log.warn(
          { story_id: storyID },
          "story that was going to be merged was not found"
        );
        return true;
      }

      return false;
    })
  ) {
    return null;
  }

  let updatedCount: number | undefined;

  // Move all the comment's from the source stories over to the destination
  // story.
  ({ modifiedCount: updatedCount } = await mergeManyCommentStories(
    mongo,
    tenant.id,
    destinationID,
    sourceIDs
  ));

  log.debug(
    { updated_comments: updatedCount },
    "updated comments while merging stories"
  );

  // Update all the action's that referenced the old story to reference the new
  // story.
  ({ modifiedCount: updatedCount } = await mergeManyRootActions(
    mongo,
    tenant.id,
    destinationID,
    sourceIDs
  ));

  log.debug(
    { updated_actions: updatedCount },
    "updated actions while merging stories"
  );

  // Merge the action counts for all the source stories.
  const [, ...sourceStories] = stories;
  const destinationStory = await updateCommentStatusCount(
    mongo,
    tenant.id,
    destinationID,
    mergeCommentStatusCount(
      // We perform the type assertion here because above, we already verified
      // that none of the stories are null.
      (sourceStories as Story[]).map(({ comment_counts }) => comment_counts)
    )
  );
  if (!destinationStory) {
    log.warn("destination story cannot be updated with new comment counts");
    return null;
  }

  log.debug(
    { comment_counts: destinationStory.comment_counts },
    "updated destination story with new comment counts"
  );

  const { deletedCount } = await removeStories(mongo, tenant.id, sourceIDs);

  log.debug({ deleted_stories: deletedCount }, "deleted source stories");

  // Return the story that had the other stories merged into.
  return destinationStory;
}
