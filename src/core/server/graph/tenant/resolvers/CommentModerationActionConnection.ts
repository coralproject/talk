import { GQLCommentModerationActionConnectionTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { CommentModerationAction } from "talk-server/models/action/moderation/comment";
import { Connection } from "talk-server/models/helpers/connection";

export const CommentModerationActionConnection: GQLCommentModerationActionConnectionTypeResolver<
  Connection<CommentModerationAction>
> = {
  nodes: ({ edges }) => edges.map(({ node }) => node),
};
