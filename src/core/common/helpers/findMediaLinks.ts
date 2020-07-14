type MediaType = "twitter" | "youtube";

export interface MediaLink {
  url: string;
  type: MediaType;
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
