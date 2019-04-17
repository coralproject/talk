const basePath = "/admin/moderate";

export default function getModerationLink(
  queue?: "default" | "reported" | "pending" | "unmoderated" | "rejected",
  storyID?: string
) {
  const queuePart = queue && queue !== "default" ? `/${queue}` : "";
  const storyPart = storyID ? `/${storyID}` : "";
  return `${basePath}${queuePart}${storyPart}`;
}
