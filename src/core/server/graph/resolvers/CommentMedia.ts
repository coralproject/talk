import * as comment from "coral-server/models/comment";

import { TypeResolveFn } from "coral-server/graph/schema/__generated__/types";

type CommentMediaType =
  | "GiphyMedia"
  | "YouTubeMedia"
  | "TwitterMedia"
  | "ExternalMedia";

const resolveType: TypeResolveFn<CommentMediaType, comment.CommentMedia> = (
  embed
) => {
  switch (embed.type) {
    case "giphy":
      return "GiphyMedia";
    case "youtube":
      return "YouTubeMedia";
    case "twitter":
      return "TwitterMedia";
    case "external":
      return "ExternalMedia";
    default:
      // TODO: replace with better error.
      throw new Error("invalid embed type");
  }
};
export const CommentMedia = {
  __resolveType: resolveType,
};
