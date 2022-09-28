type MediaType = "twitter" | "youtube" | "external";

export interface MediaLink {
  type: MediaType;
  url: string;
}

export function isMediaLink<T extends {}>(
  link: T | MediaLink
): link is MediaLink {
  if (
    ((link as MediaLink).type === "twitter" ||
      (link as MediaLink).type === "external" ||
      (link as MediaLink).type === "youtube") &&
    (link as MediaLink).url
  ) {
    return true;
  }

  return false;
}

function formatLink(type: MediaType, url: string): MediaLink {
  return {
    url: url.startsWith("http") ? url : `https://${url}`,
    type,
  };
}

const patterns: ReadonlyArray<{ type: MediaType; pattern: RegExp }> = [
  {
    type: "youtube",
    pattern:
      /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[-_a-zA-z0-9]{1,12}|youtu\.be\/[-_a-zA-z0-9]{1,12})/g,
  },
  {
    type: "twitter",
    pattern:
      /(https?:\/\/)?(www\.|mobile\.)?(twitter\.com\/[a-zA-z0-9]+\/status\/[0-9]+)/g,
  },
];

export function findMediaLinks(body: string): MediaLink[] {
  const media: MediaLink[] = [];

  // For each of the patterns available...
  for (const { type, pattern } of patterns) {
    // Find all urls in the body with the pattern and put it into a set to
    // deduplicate it.
    const urls = new Set(body.match(pattern) || []);

    // For each of the unique urls, format the url to a media link and push it
    // in.
    Array.from(urls).forEach((url) => {
      media.push(formatLink(type, url));
    });
  }

  return media;
}
