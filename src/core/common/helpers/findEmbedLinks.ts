type EmbedType = "twitter" | "youtube";

export interface EmbedLink {
  url: string;
  type: EmbedType;
}

function formatLink(type: EmbedType, link: string): EmbedLink {
  return {
    url: link,
    type,
  };
}

const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[-_a-zA-z0-9]{1,12}|youtu\.be\/[-_a-zA-z0-9]{1,12})/g;
const twitterRegex = /(https?:\/\/)?(www\.)?(twitter\.com\/[a-zA-z0-9]+\/status\/[0-9]+)/g;

export function findEmbedLinks(body: string): EmbedLink[] {
  const foundYouTubeLinks = new Set(body.match(youtubeRegex) || []);
  const foundTwitterLinks = new Set(body.match(twitterRegex) || []);

  const embeds = [
    ...[...foundYouTubeLinks].map((l) => formatLink("youtube", l)),
    ...[...foundTwitterLinks].map((l) => formatLink("twitter", l)),
  ];

  return embeds;
}
