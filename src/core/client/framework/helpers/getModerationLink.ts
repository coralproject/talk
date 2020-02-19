import urls from "./urls";

export type QUEUE_NAME =
  | "reported"
  | "pending"
  | "unmoderated"
  | "rejected"
  | "approved";

interface Options {
  queue?: QUEUE_NAME;
  storyID?: string | null;
  siteID?: string | null;
}

export default function getModerationLink({
  queue,
  storyID,
  siteID,
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

  return parts.join("/");
}
