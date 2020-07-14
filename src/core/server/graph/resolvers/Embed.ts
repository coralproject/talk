import { GQLCommentEmbedTypeResolver } from "coral-server/graph/schema/__generated__/types";
import * as comment from "coral-server/models/comment";

const resolveType: GQLCommentEmbedTypeResolver<comment.CommentEmbed> = (
  embed
) => {
  switch (embed.type) {
    case "giphy":
      return "GiphyEmbed";
    case "youtube":
      return "YoutubeEmbed";
    case "twitter":
      return "TwitterEmbed";
    default:
      // TODO: replace with better error.
      throw new Error("invalid embed type");
  }
};
export const CommentEmbed = {
  __resolveType: resolveType,
};
