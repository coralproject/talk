import { SectionFilter } from "coral-common/section";

import urls from "./urls";

export type QUEUE_NAME =
  | "reported"
  | "pending"
  | "unmoderated"
  | "rejected"
  | "approved"
  | "review";

export interface Options {
  queue?: QUEUE_NAME;
  storyID?: string | null;
  siteID?: string | null;
  commentID?: string | null;
  section?: SectionFilter | null;
}

export default function getModerationLink({
  queue,
  storyID,
  siteID,
  commentID,
  section,
}: Options = {}) {
  const parts = [urls.admin.moderate];

  // Add the queue.
  if (queue) {
    parts.push(queue);
  }

  // Add the storyID.
  if (storyID) {
    parts.push("stories", encodeURIComponent(storyID));
  } else if (siteID) {
    parts.push("sites", encodeURIComponent(siteID));
  } else if (commentID) {
    parts.push("comment", commentID);
  }

  const path = parts.join("/");

  if (section) {
    const { name } = section;
    if (name) {
      return path + "?section=" + encodeURIComponent(name);
    }

    return path + "?section=";
  }

  return path;
}
