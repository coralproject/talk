type MediaType = "twitter" | "youtube";

export interface MediaLink {
  type: MediaType;
  url: string;
}

export function isMediaLink<T extends {}>(
  link: T | MediaLink
): link is MediaLink {
  if (
    ((link as MediaLink).type === "twitter" ||
      (link as MediaLink).type === "youtube") &&
    (link as MediaLink).url
  ) {
    return true;
  }

  return false;
}

function formatLink(type: MediaType, link: string): MediaLink {
  return {
    url: link,
    type,
  };
}

const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[-_a-zA-z0-9]{1,12}|youtu\.be\/[-_a-zA-z0-9]{1,12})/g;
const twitterRegex = /(https?:\/\/)?(www\.)?(twitter\.com\/[a-zA-z0-9]+\/status\/[0-9]+)/g;

export function findMediaLinks(body: string): MediaLink[] {
  const foundYouTubeLinks = new Set(body.match(youtubeRegex) || []);
  const foundTwitterLinks = new Set(body.match(twitterRegex) || []);

  const media = [
    ...[...foundYouTubeLinks].map((l) => formatLink("youtube", l)),
    ...[...foundTwitterLinks].map((l) => formatLink("twitter", l)),
  ];

  return media;
}
