import { pick, remove } from "lodash";
import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import { getViewer, roleIsAtLeast } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { globalErrorReporter } from "coral-framework/lib/errors";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  LOCAL_ID,
  lookup,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";
import {
  GQLComment,
  GQLStory,
  GQLSTORY_MODE,
  GQLTAG,
  GQLUSER_ROLE,
} from "coral-framework/schema";
import { MAX_REPLY_INDENT_DEPTH } from "coral-stream/constants";
import { CreateCommentReplyEvent } from "coral-stream/events";

import { CreateCommentReplyMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentReplyMutation.graphql";

import {
  determineDepthTillAncestor,
  determineDepthTillStory,
  getFlattenedReplyAncestorID,
  incrementStoryCommentCounts,
  isPublished,
  lookupFlattenReplies,
  lookupStoryConnectionKey,
  lookupStoryConnectionOrderBy,
  lookupStoryConnectionTag,
  prependCommentEdgeToProfile,
} from "../../helpers";

export type CreateCommentReplyInput = Omit<
  MutationInput<MutationTypes>,
  "flattenReplies"
> & {
  local?: boolean;
};

function sharedUpdater(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: CreateCommentReplyInput,
  uuidGenerator: CoralContext["uuidGenerator"]
) {
  const commentEdge = store
    .getRootField("createCommentReply")!
    .getLinkedRecord("edge")!;
  const node = commentEdge.getLinkedRecord("node")!;
  const status = node.getValue("status");
  node.setValue("CREATE", "lastViewerAction");

  // If comment is not published, we don't need to add it.
  if (!isPublished(status)) {
    return;
  }

  incrementStoryCommentCounts(store, input.storyID, commentEdge);
  prependCommentEdgeToProfile(environment, store, commentEdge);
  tagExpertAnswers(environment, store, input, commentEdge, uuidGenerator);
  if (input.local) {
    addLocalCommentReplyToStory(store, input, commentEdge);
  } else {
    addCommentReplyToStory(environment, store, input, commentEdge);
  }
}

function tagExpertAnswers(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: CreateCommentReplyInput,
  commentEdge: RecordProxy,
  uuidGenerator: CoralContext["uuidGenerator"]
) {
  const node = commentEdge.getLinkedRecord("node");
  if (!node) {
    return;
  }
  const story = store.get(input.storyID);
  if (!story) {
    return;
  }
  const storySettings = story.getLinkedRecord("settings");
  const mode = storySettings?.getValue("mode");
  if (mode !== GQLSTORY_MODE.QA) {
    return;
  }
  const viewer = getViewer(environment)!;
  const experts = storySettings?.getLinkedRecords("experts");

  // if the author is an expert
  if (experts && experts.some((exp) => exp.getValue("id") === viewer.id)) {
    const tags = node.getLinkedRecords("tags");
    if (tags) {
      const featuredTag = store.create(uuidGenerator(), "Tag");
      featuredTag.setValue(GQLTAG.FEATURED, "code");
      commentEdge.setLinkedRecords(tags.concat(featuredTag), "tags");
    }

    const parentProxy = store.get(input.parentID);
    const parentTags = parentProxy?.getLinkedRecords("tags");
    const wasUnanswered =
      parentTags &&
      parentTags.find((t) => t.getValue("code") === GQLTAG.UNANSWERED);

    if (wasUnanswered) {
      // remove unanswered tag from parent
      if (parentProxy && parentTags && wasUnanswered) {
        parentProxy.setLinkedRecords(
          remove(parentTags, (tag) => {
            return tag.getValue("code") === GQLTAG.UNANSWERED;
          }),
          "tags"
        );
      }

      const commentCountsRecord = story.getLinkedRecord("commentCounts");
      if (!commentCountsRecord) {
        return;
      }
      const tagsRecord = commentCountsRecord.getLinkedRecord("tags");

      // increment answered questions and decrement unanswered questions
      if (tagsRecord) {
        tagsRecord.setValue(
          (tagsRecord.getValue("UNANSWERED") as number) - 1,
          "UNANSWERED"
        );
        tagsRecord.setValue(
          (tagsRecord.getValue("FEATURED") as number) + 1,
          "FEATURED"
        );
      }
    }
  }
}

/**
 * update integrates new comment into the CommentConnection.
 */
function addCommentReplyToStory(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: CreateCommentReplyInput,
  commentEdge: RecordProxy
) {
  const flattenReplies = lookupFlattenReplies(environment);
  const singleCommentID = lookup(environment, LOCAL_ID).commentID;
  const comment = commentEdge.getLinkedRecord("node")!;
  const depth = singleCommentID
    ? determineDepthTillAncestor(store, comment, singleCommentID)
    : determineDepthTillStory(
        store,
        comment,
        input.storyID,
        lookupStoryConnectionOrderBy(environment),
        lookupStoryConnectionKey(environment),
        lookupStoryConnectionTag(environment)
      );

  if (depth === null) {
    // could not trace back to ancestor, that should not happen.
    globalErrorReporter.report(
      new Error("Couldn't find reply parent in Relay store")
    );
    return;
  }

  const outsideOfView = depth >= MAX_REPLY_INDENT_DEPTH;
  let parentProxy = store.get(input.parentID)!;

  if (outsideOfView) {
    if (!flattenReplies) {
      // This should never happen!
      globalErrorReporter.report(
        new Error("Reply should have been a local reply")
      );
      return;
    }
    // In flatten replies we change the parent to the last level ancestor.
    const ancestorID = getFlattenedReplyAncestorID(comment, depth)! as string;
    parentProxy = store.get(ancestorID)!;
  }

  // Get parent proxy.
  const connectionKey = "ReplyList_replies";
  const filters = { orderBy: "CREATED_AT_ASC" };

  if (parentProxy) {
    const con = ConnectionHandler.getConnection(
      parentProxy,
      connectionKey,
      filters
    );
    if (con) {
      ConnectionHandler.insertEdgeAfter(con, commentEdge);
    }
  }
}

/**
 * localUpdate is like update but updates the `localReplies` endpoint.
 */
function addLocalCommentReplyToStory(
  store: RecordSourceSelectorProxy,
  input: CreateCommentReplyInput,
  commentEdge: RecordProxy
) {
  const newComment = commentEdge.getLinkedRecord("node")!;

  // Get parent proxy.
  const parentProxy = store.get(input.parentID);

  if (parentProxy) {
    const localReplies = parentProxy.getLinkedRecords("localReplies");
    const nextLocalReplies = localReplies
      ? localReplies.concat(newComment)
      : [newComment];
    parentProxy.setLinkedRecords(nextLocalReplies, "localReplies");
  }
}

/** These are needed to be included when querying for the stream. */
// eslint-disable-next-line no-unused-expressions
graphql`
  fragment CreateCommentReplyMutation_story on Story {
    url
    settings {
      moderation
    }
  }
`;
// eslint-disable-next-line no-unused-expressions
graphql`
  fragment CreateCommentReplyMutation_viewer on User {
    role
    badges
    createdAt
    status {
      current
      ban {
        active
      }
    }
  }
`;
/** end */
const mutation = graphql`
  mutation CreateCommentReplyMutation(
    $input: CreateCommentReplyInput!
    $flattenReplies: Boolean!
  ) {
    createCommentReply(input: $input) {
      edge {
        cursor
        node {
          ...AllCommentsTabCommentContainer_comment
          id
          status
          story {
            settings {
              # Load the story live settings so new comments can verify if live
              # updates are still enabled (and enable then if they are).
              live {
                enabled
              }
            }
          }
          parent {
            id
            tags {
              code
            }
          }
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

async function commit(
  environment: Environment,
  input: CreateCommentReplyInput,
  { uuidGenerator, relayEnvironment, eventEmitter }: CoralContext
) {
  const parentComment = lookup<GQLComment>(environment, input.parentID)!;
  const viewer = getViewer(environment)!;
  const currentDate = new Date().toISOString();
  const id = uuidGenerator();
  const story = lookup<GQLStory>(relayEnvironment, input.storyID)!;
  const storySettings = story.settings;
  if (!storySettings || !storySettings.moderation) {
    throw new Error("Moderation mode of the story was not included");
  }

  // TODO: Generate and use schema types.
  const expectPremoderation =
    !roleIsAtLeast(viewer.role, GQLUSER_ROLE.STAFF) &&
    storySettings.moderation === "PRE";

  const createCommentReplyEvent = CreateCommentReplyEvent.begin(eventEmitter, {
    body: input.body,
    parentID: input.parentID,
  });

  try {
    const result = await commitMutationPromiseNormalized<MutationTypes>(
      environment,
      {
        mutation,
        variables: {
          input: {
            storyID: input.storyID,
            parentID: input.parentID,
            parentRevisionID: input.parentRevisionID,
            body: input.body || "",
            nudge: input.nudge,
            clientMutationId: clientMutationId.toString(),
            media: input.media,
          },
          flattenReplies: lookupFlattenReplies(environment),
        },
        optimisticResponse: {
          createCommentReply: {
            edge: {
              cursor: currentDate,
              node: {
                id,
                enteredLive: false,
                createdAt: currentDate,
                status: "NONE",
                pending: false,
                lastViewerAction: "CREATE",
                hasTraversalFocus: false,
                author: {
                  id: viewer.id,
                  username: viewer.username || null,
                  createdAt: viewer.createdAt,
                  bio: viewer.bio,
                  badges: viewer.badges,
                  ignoreable: false,
                  avatar: viewer.avatar,
                },
                body: input.body || "",
                revision: {
                  id: uuidGenerator(),
                  media: null,
                },
                canReply: true,
                rating: null,
                parent: {
                  id: parentComment.id,
                  author: parentComment.author
                    ? pick(parentComment.author, "username", "id")
                    : null,
                  tags: parentComment.tags.map((tag) => ({ code: tag.code })),
                },
                editing: {
                  editableUntil: new Date(Date.now() + 10000).toISOString(),
                  edited: false,
                },
                actionCounts: {
                  reaction: {
                    total: 0,
                  },
                },
                tags: roleIsAtLeast(viewer.role, GQLUSER_ROLE.STAFF)
                  ? [{ code: "STAFF" }]
                  : [],
                viewerActionPresence: {
                  reaction: false,
                  dontAgree: false,
                  flag: false,
                },
                story: {
                  id: input.storyID,
                  url: story.url,
                  settings: {
                    live: {
                      enabled: storySettings.live.enabled,
                    },
                  },
                },
                site: {
                  id: uuidGenerator(),
                },
                replies: {
                  edges: [],
                  viewNewEdges: [],
                  pageInfo: { endCursor: null, hasNextPage: false },
                },
                deleted: false,
                seen: true,
              },
            },
            clientMutationId: (clientMutationId++).toString(),
          },
          // TODO: (cvle) fix types.
        } as any,
        optimisticUpdater: (store) => {
          // Skip optimistic update if comment is probably premoderated.
          if (expectPremoderation) {
            return;
          }
          sharedUpdater(environment, store, input, uuidGenerator);
          store.get(id)!.setValue(true, "pending");
        },
        updater: (store) => {
          sharedUpdater(environment, store, input, uuidGenerator);
        },
      }
    );
    createCommentReplyEvent.success({
      id: result.edge.node.id,
      status: result.edge.node.status,
    });
    return result;
  } catch (error) {
    createCommentReplyEvent.error({ message: error.message, code: error.code });
    throw error;
  }
}

export const withCreateCommentReplyMutation = createMutationContainer(
  "createCommentReply",
  commit
);

export type CreateCommentReplyMutation = (
  input: CreateCommentReplyInput
) => MutationResponsePromise<MutationTypes, "createCommentReply">;
