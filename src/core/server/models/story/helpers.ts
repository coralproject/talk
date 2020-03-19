import { DateTime } from "luxon";
import { URL } from "url";

import { parseQuery, stringifyQuery } from "coral-common/utils";
import { Tenant } from "coral-server/models/tenant";

import { Story } from ".";

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
  return closedAt && closedAt <= now;
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
