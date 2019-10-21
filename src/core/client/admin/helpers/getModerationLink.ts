const basePath = "/admin/moderate";

export default function getModerationLink(
  queue?: "default" | "reported" | "pending" | "unmoderated" | "rejected",
  storyID?: string | null
) {
  const queuePart = queue && queue !== "default" ? `/${queue}` : "";
  const storyPart = storyID ? `/${encodeURIComponent(storyID)}` : "";
  return `${basePath}${queuePart}${storyPart}`;
}
