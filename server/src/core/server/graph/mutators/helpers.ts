import {
  CommentNotFoundError,
  StoryNotFoundError,
  UserForbiddenError,
} from "coral-server/errors";
import { User } from "coral-server/models/user";
import {
  canModerate,
  canModerateUnscoped,
  ModerationScopeResource,
} from "coral-server/models/user/helpers";

import GraphContext from "../context";

interface CommentResourceModerationScope {
  commentID: string;
}

function isCommentResourceModerationScope(
  scope: ResourceModerationScopes
): scope is CommentResourceModerationScope {
  if ((scope as CommentResourceModerationScope).commentID) {
    return true;
  }

  return false;
}

interface StoryResourceModerationScope {
  storyID: string;
}

function isStoryResourceModerationScope(
  scope: ResourceModerationScopes
): scope is StoryResourceModerationScope {
  if ((scope as StoryResourceModerationScope).storyID) {
    return true;
  }

  return false;
}

interface SiteResourceModerationScope {
  siteID: string;
}

type ResourceModerationScopes =
  | StoryResourceModerationScope
  | CommentResourceModerationScope
  | SiteResourceModerationScope;

/**
 * validateUserModerationScopes will validate if the user has access to
 * moderating the resource indicated by the resource scopes.
 *
 * @param ctx the graph context for this request
 * @param user the user being evaluated
 * @param scope scope keys for the documents referencing moderation scopes
 */
export async function validateUserModerationScopes(
  ctx: GraphContext,
  user: Pick<User, "id" | "role" | "moderationScopes">,
  scope: ResourceModerationScopes
) {
  // If the user has no restrictions on them, exit now.
  if (canModerateUnscoped(user)) {
    return;
  }

  let resource: ModerationScopeResource;

  if (isCommentResourceModerationScope(scope)) {
    // Because the user has siteID restrictions on their moderator capabilities,
    // we have to check the siteID of the comment before we make a decision.
    const comment = await ctx.loaders.Comments.comment.load(scope.commentID);
    if (!comment) {
      throw new CommentNotFoundError(scope.commentID);
    }

    resource = comment;
  } else if (isStoryResourceModerationScope(scope)) {
    // Because the user has siteID restrictions on their moderator capabilities,
    // we have to check the siteID of the story before we make a decision.
    const story = await ctx.loaders.Stories.story.load(scope.storyID);
    if (!story) {
      throw new StoryNotFoundError(scope.storyID);
    }

    resource = story;
  } else {
    resource = { siteID: scope.siteID };
  }

  // Check to see if this user is allowed to moderate this comment.
  if (canModerate(user, resource)) {
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
