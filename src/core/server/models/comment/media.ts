import { GQLCOMMENT_MEDIA_PROVIDER } from "coral-server/graph/schema/__generated__/types";

export interface CommentMedia {
  provider: GQLCOMMENT_MEDIA_PROVIDER;
  url: string;
  width: number;
  height: number;
  remote_id: string;
  mimetype: string;
  alt: string;
}
