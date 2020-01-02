const basePath = "/admin/moderate";

export type QUEUE_NAME =
  | "default"
  | "reported"
  | "pending"
  | "unmoderated"
  | "rejected";

export default function getModerationLink(
  queue?: QUEUE_NAME,
  storyID?: string | null,
  siteID?: string | null
) {
  const queuePart = queue && queue !== "default" ? `/${queue}` : "";
  const storyPart = storyID ? `/stories/${encodeURIComponent(storyID)}` : "";
  const sitePart = siteID ? `/sites/${encodeURIComponent(siteID)}` : "";
  return `${basePath}${queuePart}${sitePart}${storyPart}`;
}
