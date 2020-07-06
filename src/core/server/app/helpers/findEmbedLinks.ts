import { GQLEMBED_SOURCE } from "coral-server/graph/schema/__generated__/types";

export interface EmbedLink {
  url: string;
  source: GQLEMBED_SOURCE;
}

function formatLink(source: GQLEMBED_SOURCE, link: string): EmbedLink {
  return {
    url: link,
    source,
  };
}

export function findEmbedLinks(body: string): EmbedLink[] {
  const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[-_a-zA-z0-9]{1,12}|youtu\.be\/[-_a-zA-z0-9]{1,12})/g;
  const twitterRegex = /(https?:\/\/)?(www\.)?(twitter\.com\/[a-zA-z0-9]+\/status\/[0-9]+)/g;

  const foundYouTubeLinks = new Set(body.match(youtubeRegex) || []);
  const foundTwitterLinks = new Set(body.match(twitterRegex) || []);

  const embeds = [
    ...[...foundYouTubeLinks].map((l) =>
      formatLink(GQLEMBED_SOURCE.YOUTUBE, l)
    ),
    ...[...foundTwitterLinks].map((l) =>
      formatLink(GQLEMBED_SOURCE.TWITTER, l)
    ),
  ];

  return embeds;
}
