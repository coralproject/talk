import { zip } from "lodash";
import { DateTime } from "luxon";
import { Db } from "mongodb";

import {
  doesRequireSchemePrefixing,
  getOrigin,
  isURLSecure,
  prefixSchemeIfRequired,
} from "talk-server/app/url";
import { StoryURLInvalidError } from "talk-server/errors";
import logger from "talk-server/logger";
import {
  countTotalActionCounts,
  mergeCommentActionCounts,
  mergeManyStoryActions,
  removeStoryActions,
} from "talk-server/models/action/comment";
import {
  mergeManyCommentStories,
  removeStoryComments,
} from "talk-server/models/comment";
import {
  calculateTotalCommentCount,
  closeStory,
  createStory,
  CreateStoryInput,
  findOrCreateStory,
  FindOrCreateStoryInput,
  mergeCommentStatusCount,
  openStory,
  removeStories,
  removeStory,
  retrieveManyStories,
  retrieveStory,
  Story,
  updateStory,
  updateStoryActionCounts,
  updateStoryCommentStatusCount,
  UpdateStoryInput,
  updateStorySettings,
  UpdateStorySettingsInput,
} from "talk-server/models/story";
import { Tenant } from "talk-server/models/tenant";
import { ScraperQueue } from "talk-server/queue/tasks/scraper";
import { scrape } from "talk-server/services/stories/scraper";

import { AugmentedRedis } from "../redis";

export type FindOrCreateStory = FindOrCreateStoryInput;

export async function findOrCreate(
  mongo: Db,
  tenant: Tenant,
  input: FindOrCreateStory,
  scraper: ScraperQueue,
  now = new Date()
) {
  // If the URL is provided, and the url is not on a allowed domain, then refuse
  // to create the Asset.
  if (input.url && !isURLPermitted(tenant, input.url)) {
    throw new StoryURLInvalidError({
      storyURL: input.url,
      tenantDomains: tenant.domains,
    });
  }

  // TODO: check to see if the tenant has enabled lazy story creation, if they haven't, switch to find only.

  const story = await findOrCreateStory(mongo, tenant.id, input, now);
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
    storyID,
    includeComments,
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
    // Remove the actions associated with the comments we just removed.
    const { deletedCount: removedActions } = await removeStoryActions(
      mongo,
      tenant.id,
      story.id
    );

    log.debug({ removedActions }, "removed actions while deleting story");

    // Remove the comments for the story.
    const { deletedCount: removedComments } = await removeStoryComments(
      mongo,
      tenant.id,
      story.id
    );

    log.debug({ removedComments }, "removed comments while deleting story");
  } else if (calculateTotalCommentCount(story.commentCounts.status) > 0) {
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
  { metadata }: CreateStory,
  now = new Date()
) {
  // Ensure that the given URL is allowed.
  if (!isURLPermitted(tenant, storyURL)) {
    throw new StoryURLInvalidError({ storyURL, tenantDomains: tenant.domains });
  }

  // Construct the input payload.
  const input: CreateStoryInput = { metadata };
  if (metadata) {
    input.scrapedAt = now;
  }

  // Create the story in the database.
  let newStory = await createStory(
    mongo,
    tenant.id,
    storyID,
    storyURL,
    input,
    now
  );
  if (!metadata) {
    // If the scraper has not scraped this story and story metadata was not
    // provided, we need to scrape it now!
    newStory = await scrape(mongo, tenant.id, newStory.id, storyURL);
  }

  return newStory;
}

export type UpdateStory = UpdateStoryInput;

export async function update(
  mongo: Db,
  tenant: Tenant,
  storyID: string,
  input: UpdateStory,
  now = new Date()
) {
  // Ensure that the given URL is allowed.
  if (input.url && !isURLPermitted(tenant, input.url)) {
    throw new StoryURLInvalidError({
      storyURL: input.url,
      tenantDomains: tenant.domains,
    });
  }

  return updateStory(mongo, tenant.id, storyID, input, now);
}
export type UpdateStorySettings = UpdateStorySettingsInput;

export async function updateSettings(
  mongo: Db,
  tenant: Tenant,
  storyID: string,
  input: UpdateStorySettings,
  now = new Date()
) {
  return updateStorySettings(mongo, tenant.id, storyID, input, now);
}

export async function open(
  mongo: Db,
  tenant: Tenant,
  storyID: string,
  now = new Date()
) {
  return openStory(mongo, tenant.id, storyID, now);
}

export async function close(
  mongo: Db,
  tenant: Tenant,
  storyID: string,
  now = new Date()
) {
  return closeStory(mongo, tenant.id, storyID, now);
}

export async function merge(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  destinationID: string,
  sourceIDs: string[]
) {
  // Create a logger for this operation.
  const log = logger.child({
    destinationID,
    sourceIDs,
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
          { storyID },
          "story that was going to be merged was not found"
        );
        return true;
      }

      return false;
    })
  ) {
    return null;
  }

  // Move all the comment's from the source stories over to the destination
  // story.
  const { modifiedCount: updatedComments } = await mergeManyCommentStories(
    mongo,
    tenant.id,
    destinationID,
    sourceIDs
  );

  log.debug({ updatedComments }, "updated comments while merging stories");

  // Update all the action's that referenced the old story to reference the new
  // story.
  const { modifiedCount: updatedActions } = await mergeManyStoryActions(
    mongo,
    tenant.id,
    destinationID,
    sourceIDs
  );

  log.debug({ updatedActions }, "updated actions while merging stories");

  // Merge the comment and action counts for all the source stories.
  const [, ...sourceStories] = stories;

  let destinationStory = await updateStoryCommentStatusCount(
    mongo,
    redis,
    tenant.id,
    destinationID,
    mergeCommentStatusCount(
      // We perform the type assertion here because above, we already verified
      // that none of the stories are null.
      (sourceStories as Story[]).map(({ commentCounts: { status } }) => status)
    )
  );

  const mergedActionCounts = mergeCommentActionCounts(
    // We perform the type assertion here because above, we already verified
    // that none of the stories are null.
    ...(sourceStories as Story[]).map(({ commentCounts: { action } }) => action)
  );
  if (countTotalActionCounts(mergedActionCounts) > 0) {
    destinationStory = await updateStoryActionCounts(
      mongo,
      redis,
      tenant.id,
      destinationID,
      mergedActionCounts
    );
  }

  if (!destinationStory) {
    log.warn("destination story cannot be updated with new comment counts");
    return null;
  }

  log.debug(
    { commentCounts: destinationStory.commentCounts.status },
    "updated destination story with new comment counts"
  );

  // Remove the stories from MongoDB.
  const { deletedCount } = await removeStories(mongo, tenant.id, sourceIDs);

  log.debug({ deletedStories: deletedCount }, "deleted source stories");

  // Return the story that had the other stories merged into.
  return destinationStory;
}

export function getStoryClosedAt(
  tenant: Pick<Tenant, "closeCommenting">,
  story: Pick<Story, "closedAt" | "createdAt">
): Story["closedAt"] {
  // Try to get the closedAt time from the story.
  if (story.closedAt) {
    return story.closedAt;
  }

  // Check to see if the story has been forced open again.
  if (story.closedAt === false) {
    return false;
  }

  // If the story hasn't already been closed, then check to see if the Tenant
  // has the auto close stream enabled.
  if (tenant.closeCommenting.auto) {
    // Auto-close stream has been enabled, convert the createdAt time into the
    // closedAt time by adding the closedTimeout.
    return (
      DateTime.fromJSDate(story.createdAt)
        // closedTimeout is in seconds, so multiply by 1000 to get
        // milliseconds.
        .plus(tenant.closeCommenting.timeout * 1000)
        .toJSDate()
    );
  }

  return;
}
