import { DateTime } from "luxon";
import { URL } from "url";

import { parseQuery, stringifyQuery } from "coral-common/utils";
import { hasFeatureFlag, Tenant } from "coral-server/models/tenant";

import {
  GQLFEATURE_FLAG,
  GQLSTORY_MODE,
} from "coral-server/graph/schema/__generated__/types";

import { Story } from "./story";

/**
 * getURLWithCommentID returns the url with the comment id.
 *
 * @param storyURL url of the story
 * @param commentID id of the comment
 */
export function getURLWithCommentID(storyURL: string, commentID?: string) {
  const url = new URL(storyURL);
  const query = parseQuery(url.search);
  url.search = stringifyQuery({ ...query, commentID });

  return url.toString();
}

export function getStoryTitle(story: Pick<Story, "metadata" | "url">) {
  return story.metadata && story.metadata.title
    ? story.metadata.title
    : story.url;
}

export function isStoryClosed(
  tenant: Pick<Tenant, "closeCommenting">,
  story: Pick<Story, "closedAt" | "createdAt">,
  now = new Date()
) {
  const closedAt = getStoryClosedAt(tenant, story);
  return !!closedAt && closedAt <= now;
}

export function getStoryClosedAt(
  tenant: Pick<Tenant, "closeCommenting">,
  story: Pick<Story, "closedAt" | "createdAt">
): Date | null {
  // Try to get the closedAt time from the story.
  if (story.closedAt) {
    return story.closedAt;
  }

  // Check to see if the story has been forced open again.
  if (story.closedAt === false) {
    return null;
  }

  // If the story hasn't already been closed, then check to see if the Tenant
  // has the auto close stream enabled.
  if (tenant.closeCommenting.auto) {
    // Auto-close stream has been enabled, convert the createdAt time into the
    // closedAt time by adding the closedTimeout.
    return DateTime.fromJSDate(story.createdAt)
      .plus({ seconds: tenant.closeCommenting.timeout })
      .toJSDate();
  }

  return null;
}

export function isStoryArchiving(
  story: Pick<Story, "isArchiving" | "isArchived">
) {
  if (story.isArchived) {
    return false;
  }

  return story.isArchiving ?? false;
}

export function isStoryArchived(story: Pick<Story, "isArchived">) {
  return story.isArchived ?? false;
}

export function isStoryUnarchiving(story: Pick<Story, "isUnarchiving">) {
  return story.isUnarchiving ?? false;
}

export function resolveStoryMode(
  storySettings: Story["settings"],
  tenant: Pick<Tenant, "featureFlags">
) {
  if (
    storySettings.mode === GQLSTORY_MODE.QA &&
    hasFeatureFlag(tenant, GQLFEATURE_FLAG.ENABLE_QA)
  ) {
    return GQLSTORY_MODE.QA;
  }

  if (
    storySettings.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS &&
    hasFeatureFlag(tenant, GQLFEATURE_FLAG.ENABLE_RATINGS_AND_REVIEWS)
  ) {
    return GQLSTORY_MODE.RATINGS_AND_REVIEWS;
  }

  // FEATURE_FLAG:DEFAULT_QA_STORY_MODE
  if (hasFeatureFlag(tenant, GQLFEATURE_FLAG.DEFAULT_QA_STORY_MODE)) {
    return GQLSTORY_MODE.QA;
  }

  return GQLSTORY_MODE.COMMENTS;
}

export function isUserStoryExpert(
  storySettings: Story["settings"],
  userID: string
) {
  return !!storySettings.expertIDs?.some((id) => id === userID);
}
