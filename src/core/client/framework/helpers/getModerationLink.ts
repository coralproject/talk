import urls from "./urls";

import { SectionFilter } from "coral-common/section";

export type QUEUE_NAME =
  | "reported"
  | "pending"
  | "unmoderated"
  | "rejected"
  | "approved";

export interface Options {
  queue?: QUEUE_NAME;
  storyID?: string | null;
  siteID?: string | null;
  section?: SectionFilter | null;
}

export default function getModerationLink({
  queue,
  storyID,
  siteID,
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
