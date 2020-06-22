import { CommentNotFoundError, UserForbiddenError } from "coral-server/errors";
import { User } from "coral-server/models/user";
import { canModerate } from "coral-server/models/user/helpers";

import GraphContext from "../context";

interface ResourceModerationScopes {
  commentID: string;
}

/**
 * validateUserModerationScopes will validate if the user has access to
 * moderating the resource indicated by the resource scopes.
 *
 * @param ctx the graph context for this request
 * @param user the user being evaluated
 * @param resource scope keys for the documents referencing moderation scopes
 */
export async function validateUserModerationScopes(
  ctx: GraphContext,
  user: Pick<User, "id" | "role" | "moderationScopes">,
  resource: ResourceModerationScopes
) {
  // Because the user has siteID restrictions on their moderator capabilities,
  // we have to check the siteID of the comment before we make a decision.
  const comment = await ctx.loaders.Comments.comment.load(resource.commentID);
  if (!comment) {
    throw new CommentNotFoundError(resource.commentID);
  }

  // Check to see if this user is allowed to moderate this comment.
  if (canModerate(user, comment)) {
    return;
  }

  // The user had the right role, but had a siteID restriction that prevented
  // them from moderating this comment.
  throw new UserForbiddenError(
    "user does not have permission to moderate this comment",
    "comment",
    "mutation",
    user.id
  );
}
