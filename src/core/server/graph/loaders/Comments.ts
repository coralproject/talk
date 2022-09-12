import DataLoader from "dataloader";
import { defaultTo, isNumber } from "lodash";
import { DateTime } from "luxon";

import { StoryNotFoundError } from "coral-server/errors";
import GraphContext from "coral-server/graph/context";
import { retrieveManyUserActionPresence } from "coral-server/models/action/comment";
import {
  Comment,
  CommentConnectionInput,
  retrieveManyRecentStatusCounts,
  retrieveStoryCommentTagCounts,
} from "coral-server/models/comment";
import { retrieveSharedModerationQueueQueuesCounts } from "coral-server/models/comment/counts/shared";
import { hasPublishedStatus } from "coral-server/models/comment/helpers";
import { Connection, createEmptyConnection } from "coral-server/models/helpers";
import { Story } from "coral-server/models/story";
import { hasFeatureFlag, Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import {
  retrieveAllCommentsUserConnection,
  retrieveChildrenForParentConnection,
  retrieveCommentConnection,
  retrieveCommentParentsConnection,
  retrieveCommentRepliesConnection,
  retrieveCommentStoryConnection,
  retrieveCommentUserConnection,
  retrieveManyComments,
  retrieveRejectedCommentUserConnection,
} from "coral-server/services/comments";

import {
  CommentToParentsArgs,
  CommentToRepliesArgs,
  GQLActionPresence,
  GQLCOMMENT_SORT,
  GQLFEATURE_FLAG,
  GQLSTORY_MODE,
  GQLTAG,
  GQLUSER_ROLE,
  QueryToCommentsArgs,
  StoryToCommentsArgs,
  UserToAllCommentsArgs,
  UserToCommentsArgs,
  UserToRejectedCommentsArgs,
} from "coral-server/graph/schema/__generated__/types";

import { requiredPropertyFilter, sectionFilter } from "./helpers";
import { SingletonResolver } from "./util";

const tagFilter = (tag?: GQLTAG): CommentConnectionInput["filter"] => {
  if (tag) {
    return {
      "tags.type": tag,
    };
  }

  return {};
};

const ratingFilter = (
  tenant: Pick<Tenant, "featureFlags">,
  story: Story,
  rating?: number
): CommentConnectionInput["filter"] => {
  // If rating wasn't provided or was falsy (zero or negative), then do nothing.
  if (!isNumber(rating)) {
    return {};
  }

  // If the Tenant does not have the feature flag enabled, or the story does not
  // have this mode enabled, do nothing.
  if (
    !hasFeatureFlag(tenant, GQLFEATURE_FLAG.ENABLE_RATINGS_AND_REVIEWS) ||
    story.settings.mode !== GQLSTORY_MODE.RATINGS_AND_REVIEWS
  ) {
    return {};
  }

  // If the rating value is not a number or does not fall within bounds, then do
  // nothing.
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return {};
  }

  return { rating };
};

const flattenFilter = (
  parentID: string,
  options: { enabled: boolean } = { enabled: true }
): CommentConnectionInput["filter"] => {
  if (options.enabled) {
    return {
      ancestorIDs: parentID,
      parentID: undefined,
    };
  }
  return {};
};

const queryFilter = (query?: string): CommentConnectionInput["filter"] => {
  if (query) {
    return { $text: { $search: JSON.stringify(query) } };
  }

  return {};
};

/**
 * primeCommentsFromConnection will prime a given context with the comments
 * retrieved via a connection.
 *
 * @param ctx graph context to use to prime the loaders.
 */
const primeCommentsFromConnection =
  (ctx: GraphContext) =>
  (connection: Readonly<Connection<Readonly<Comment>>>) => {
    if (!ctx.disableCaching) {
      // For each of the nodes, prime the comment loader.
      connection.nodes.forEach((comment) => {
        ctx.loaders.Comments.visible.prime(comment.id, comment);
      });
    }

    return connection;
  };

/**
 * mapVisibleComment will provide a mapping function that will mark as null each
 * comment that should not be visible to the target User.
 *
 * @param user the User to determine the visibility status with based on
 * permissions
 */
const mapVisibleComment = (user?: Pick<User, "role">) => {
  // Check to see if this user is privileged and can view non-visible comments.
  const isPrivilegedUser = Boolean(
    user && [GQLUSER_ROLE.ADMIN, GQLUSER_ROLE.MODERATOR].includes(user.role)
  );

  // Return a function that will map out the non-visible comments if needed.
  return (comment: Readonly<Comment> | null) => {
    if (comment === null) {
      return null;
    }

    if (hasPublishedStatus(comment) || isPrivilegedUser) {
      return comment;
    }

    return null;
  };
};

/**
 * mapVisibleComments will map each comment an array to an array of Comment and
 * null.
 *
 * @param user the User to determine the visibility status with based on
 * permissions
 */
const mapVisibleComments =
  (user?: Pick<User, "role">) =>
  (
    comments: Array<Readonly<Comment> | null>
  ): Array<Readonly<Comment> | null> =>
    comments.map(mapVisibleComment(user));

export default (ctx: GraphContext) => ({
  visible: new DataLoader<string, Readonly<Comment> | null>(
    (ids: string[]) =>
      retrieveManyComments(ctx.mongo, ctx.tenant.id, ids).then(
        mapVisibleComments(ctx.user)
      ),
    {
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
  comment: new DataLoader<string, Readonly<Comment> | null>(
    (ids: string[]) => retrieveManyComments(ctx.mongo, ctx.tenant.id, ids),
    {
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
  forFilter: async ({
    first,
    after,
    storyID,
    siteID,
    section,
    status,
    tag,
    query,
    orderBy,
  }: QueryToCommentsArgs) => {
    let story: Readonly<Story> | null = null;
    if (storyID) {
      story = await ctx.loaders.Stories.story.load(storyID);
    }

    const isArchiving = story?.isArchiving || false;
    const isArchived = story?.isArchived || false;

    // If we are actively archiving, the comments are in flux as they
    // move between the live and archive mongo instances, so return an empty
    // connection for now.
    if (isArchiving) {
      return createEmptyConnection<Comment>();
    }

    return retrieveCommentConnection(
      ctx.mongo,
      ctx.tenant.id,
      {
        first: defaultTo(first, 10),
        after,
        orderBy: defaultTo(orderBy, GQLCOMMENT_SORT.CREATED_AT_DESC),
        filter: {
          ...queryFilter(query),
          ...tagFilter(tag),
          ...sectionFilter(ctx.tenant, section),
          // If these properties are not provided or are null, remove them from
          // the filter because they do not exist in a nullable state on the
          // database model.
          ...requiredPropertyFilter({ storyID, siteID, status }),
        },
      },
      isArchived
    ).then(primeCommentsFromConnection(ctx));
  },
  retrieveMyActionPresence: new DataLoader<string, GQLActionPresence>(
    (commentIDs: string[]) => {
      if (!ctx.user) {
        // This should only ever be accessed when a user is logged in. It should
        // be safe to get the user here, but we'll throw an error anyways just
        // in case.
        throw new Error("can't get action presence of an undefined user");
      }

      return retrieveManyUserActionPresence(
        ctx.mongo,
        ctx.tenant.id,
        ctx.user.id,
        commentIDs
      );
    }
  ),
  forUser: (userID: string, { first, orderBy, after }: UserToCommentsArgs) =>
    retrieveCommentUserConnection(ctx.mongo, ctx.tenant.id, userID, {
      first: defaultTo(first, 10),
      orderBy: defaultTo(orderBy, GQLCOMMENT_SORT.CREATED_AT_DESC),
      after,
    }).then(primeCommentsFromConnection(ctx)),
  forUserAll: (userID: string, { first, after }: UserToAllCommentsArgs) =>
    retrieveAllCommentsUserConnection(ctx.mongo, ctx.tenant.id, userID, {
      first: defaultTo(first, 10),
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
      after,
    }).then(primeCommentsFromConnection(ctx)),
  forUserRejected: (
    userID: string,
    { first, after }: UserToRejectedCommentsArgs
  ) =>
    retrieveRejectedCommentUserConnection(ctx.mongo, ctx.tenant.id, userID, {
      first: defaultTo(first, 10),
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
      after,
    }).then(primeCommentsFromConnection(ctx)),
  taggedForStory: async (
    storyID: string,
    tag: GQLTAG,
    { first, orderBy, after }: StoryToCommentsArgs
  ) => {
    const story = await ctx.loaders.Stories.story.load(storyID);
    if (!story) {
      throw new StoryNotFoundError(storyID);
    }

    const { isArchived } = story;
    return retrieveCommentStoryConnection(
      ctx.mongo,
      ctx.tenant.id,
      storyID,
      {
        first: defaultTo(first, 10),
        orderBy: defaultTo(orderBy, GQLCOMMENT_SORT.CREATED_AT_DESC),
        after,
        filter: {
          // Filter optionally for comments with a specific tag.
          "tags.type": tag,
        },
      },
      isArchived
    ).then(primeCommentsFromConnection(ctx));
  },
  forStory: async (
    storyID: string,
    { first, orderBy, after, tag, rating }: StoryToCommentsArgs
  ) => {
    const story = await ctx.loaders.Stories.story.load(storyID);
    if (!story) {
      throw new StoryNotFoundError(storyID);
    }

    const connection = await retrieveCommentStoryConnection(
      ctx.mongo,
      ctx.tenant.id,
      storyID,
      {
        first: defaultTo(first, 10),
        orderBy: defaultTo(orderBy, GQLCOMMENT_SORT.CREATED_AT_DESC),
        after,
        filter: {
          ...tagFilter(tag),
          ...ratingFilter(ctx.tenant, story, rating),
          // Only get Comments that are top level. If the client wants to load
          // another layer, they can request another nested connection.
          parentID: null,
        },
      },
      story.isArchived
    ).then(primeCommentsFromConnection(ctx));

    return connection;
  },
  forParent: async (
    storyID: string,
    parentID: string,
    { first, orderBy, after, flatten }: CommentToRepliesArgs
  ) => {
    const story = await ctx.loaders.Stories.story.load(storyID);
    if (!story) {
      throw new StoryNotFoundError(storyID);
    }

    const connection = await retrieveCommentRepliesConnection(
      ctx.mongo,
      ctx.tenant.id,
      storyID,
      parentID,
      {
        first: defaultTo(first, 10),
        orderBy: defaultTo(orderBy, GQLCOMMENT_SORT.CREATED_AT_DESC),
        after,
        filter: {
          ...flattenFilter(parentID, { enabled: Boolean(flatten) }),
        },
      },
      story.isArchived
    ).then(primeCommentsFromConnection(ctx));

    return connection;
  },
  parents: async (comment: Comment, { last, before }: CommentToParentsArgs) => {
    const story = await ctx.loaders.Stories.story.load(comment.storyID);
    if (!story) {
      throw new StoryNotFoundError(comment.storyID);
    }

    return retrieveCommentParentsConnection(
      ctx.mongo,
      ctx.tenant.id,
      comment,
      {
        last: defaultTo(last, 1),
        // The cursor passed here is always going to be a number.
        before: before as number,
      },
      story.isArchived
    ).then(primeCommentsFromConnection(ctx));
  },
  allChildComments: async (
    comment: Comment,
    { first, orderBy }: CommentToRepliesArgs
  ) => {
    const story = await ctx.loaders.Stories.story.load(comment.storyID);
    if (!story) {
      throw new StoryNotFoundError(comment.storyID);
    }
    return retrieveChildrenForParentConnection(
      ctx.mongo,
      ctx.tenant.id,
      comment,
      {
        first: 9999,
        orderBy: defaultTo(orderBy, GQLCOMMENT_SORT.CREATED_AT_ASC),
      },
      story.isArchived
    ).then(primeCommentsFromConnection(ctx));
  },
  sharedModerationQueueQueuesCounts: new SingletonResolver(
    () =>
      retrieveSharedModerationQueueQueuesCounts(
        ctx.mongo,
        ctx.redis,
        ctx.tenant.id,
        ctx.now
      ),
    {
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cacheable: !ctx.disableCaching,
    }
  ),
  tagCounts: new DataLoader((storyIDs: string[]) =>
    retrieveStoryCommentTagCounts(ctx.mongo, ctx.tenant.id, storyIDs)
  ),
  authorStatusCounts: new DataLoader((authorIDs: string[]) =>
    retrieveManyRecentStatusCounts(
      ctx.mongo,
      ctx.tenant.id,
      DateTime.fromJSDate(ctx.now)
        .plus({ seconds: -ctx.tenant.recentCommentHistory.timeFrame })
        .toJSDate(),
      authorIDs
    )
  ),
});
