import { GQLCommentsConnectionTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { Comment } from "talk-server/models/comment";
import { Connection } from "talk-server/models/helpers/connection";

export const CommentsConnection: GQLCommentsConnectionTypeResolver<
  Connection<Comment>
> = {
  nodes: ({ edges }) => edges.map(({ node }) => node),
};
