import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import { getViewer, roleIsAtLeast } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLTAG, GQLUSER_ROLE } from "coral-framework/schema";
import { CreateCommentEvent } from "coral-stream/events";
import {
  incrementStoryCommentCounts,
  isPublished,
  prependCommentEdgeToProfile,
} from "coral-stream/tabs/shared/helpers";
import incrementTagCommentCounts from "coral-stream/tabs/shared/helpers/incrementTagCommentCounts";

import { LiveCreateCommentMutation as MutationTypes } from "coral-stream/__generated__/LiveCreateCommentMutation.graphql";
import { LiveCreateCommentMutation_story } from "coral-stream/__generated__/LiveCreateCommentMutation_story.graphql";
import { LiveCreateCommentMutation_viewer } from "coral-stream/__generated__/LiveCreateCommentMutation_viewer.graphql";
import { COMMENT_SORT } from "coral-stream/__generated__/StreamContainerLocal.graphql";

export type LiveCreateCommentInput = Omit<
  MutationInput<MutationTypes>,
  "flattenReplies"
> & {
  commentsOrderBy?: COMMENT_SORT;
  tag?: GQLTAG;
};

function sharedUpdater(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: LiveCreateCommentInput
) {
  const commentEdge = store
    .getRootField("createComment")!
    .getLinkedRecord("edge")!;

  const node = commentEdge.getLinkedRecord("node");
  commentEdge.setValue(node!.getValue("createdAt"), "cursor");

  const status = commentEdge.getLinkedRecord("node")!.getValue("status");
  // If comment is not visible, we don't need to add it.
  if (!isPublished(status)) {
    return;
  }

  if (input.tag) {
    incrementTagCommentCounts(store, input.storyID, input.tag);
  }

  incrementStoryCommentCounts(store, input.storyID);
  prependCommentEdgeToProfile(environment, store, commentEdge);
  addCommentToStory(store, input, commentEdge);
}

function getConnection(
  streamProxy: RecordProxy | null,
  connectionKey: string,
  filters?: any
) {
  if (!streamProxy) {
    return null;
  }

  const con = ConnectionHandler.getConnection(
    streamProxy,
    connectionKey,
    filters
  );

  return con;
}

/**
 * update integrates new comment into the CommentConnection.
 */
function addCommentToStory(
  store: RecordSourceSelectorProxy,
  input: LiveCreateCommentInput,
  commentEdge: RecordProxy
) {
  // Get stream proxy.
  const streamProxy = store.get(input.storyID)!;
  const connectionKey = "Chat_after";

  if (input.commentsOrderBy === "CREATED_AT_ASC") {
    const con = getConnection(streamProxy, connectionKey, {});
    if (con) {
      ConnectionHandler.insertEdgeAfter(con, commentEdge);
    }
  } else {
    const con = getConnection(streamProxy, connectionKey, {});
    if (con) {
      ConnectionHandler.insertEdgeBefore(con, commentEdge);
    }
  }
}

/** These are needed to be included when querying for the stream. */
// eslint-disable-next-line no-unused-expressions
graphql`
  fragment LiveCreateCommentMutation_viewer on User {
    id
    avatar
    badges
    bio
    createdAt
    role
    username
    status {
      current
      ban {
        active
      }
    }
  }
`;

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment LiveCreateCommentMutation_story on Story {
    id
    viewerRating {
      id
      tags {
        code
      }
      rating
    }
    settings {
      moderation
      mode
      live {
        enabled
      }
    }
    ratings {
      count
      average
    }
  }
`;
/** end */

const mutation = graphql`
  mutation LiveCreateCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      edge {
        cursor
        node {
          id
          status
          tags {
            code
          }
          story {
            id
            ratings {
              count
              average
            }
            ...LiveCreateCommentMutation_story @relay(mask: false)
          }
          ...LiveCommentContainer_comment
          ...LiveEditCommentFormContainer_comment
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

export const LiveCreateCommentMutation = createMutation(
  "createComment",
  async (
    environment: Environment,
    input: LiveCreateCommentInput,
    { uuidGenerator, relayEnvironment, eventEmitter }: CoralContext
  ) => {
    const viewer = getViewer<LiveCreateCommentMutation_viewer>(environment)!;
    const currentDate = new Date().toISOString();
    const id = uuidGenerator();

    const story = lookup<LiveCreateCommentMutation_story>(
      relayEnvironment,
      input.storyID
    )!;
    const storySettings = story.settings;
    if (!storySettings || !storySettings.moderation) {
      throw new Error("Moderation mode of the story was not included");
    }

    // TODO: Generate and use schema types.
    const expectPremoderation =
      !roleIsAtLeast(viewer.role, GQLUSER_ROLE.STAFF) &&
      storySettings.moderation === "PRE";

    const createCommentEvent = CreateCommentEvent.begin(eventEmitter, {
      body: input.body,
      storyID: input.storyID,
    });

    let tag: GQLTAG | undefined;
    if (input.tag) {
      tag = input.tag;
    }

    const tags = new Array<{ code: GQLTAG }>();
    if (tag) {
      tags.push({ code: tag });
    }

    switch (viewer.role) {
      case GQLUSER_ROLE.ADMIN:
        tags.push({ code: GQLTAG.ADMIN });
        break;
      case GQLUSER_ROLE.MODERATOR:
        tags.push({ code: GQLTAG.MODERATOR });
        break;
      case GQLUSER_ROLE.STAFF:
        tags.push({ code: GQLTAG.STAFF });
        break;
      default:
        break;
    }

    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation,
          variables: {
            input: {
              storyID: input.storyID,
              body: input.body || "",
              nudge: input.nudge,
              media: input.media,
              rating: input.rating,
              clientMutationId: clientMutationId.toString(),
            },
          },
          optimisticResponse: {
            createComment: {
              edge: {
                cursor: currentDate,
                node: {
                  id,
                  enteredLive: false,
                  createdAt: currentDate,
                  status: "NONE",
                  pending: false,
                  lastViewerAction: null,
                  author: {
                    id: viewer.id,
                    username: viewer.username || null,
                    bio: viewer.bio,
                    createdAt: viewer.createdAt,
                    badges: viewer.badges,
                    avatar: viewer.avatar,
                    ignoreable: false,
                  },
                  site: {
                    id: uuidGenerator(),
                  },
                  revision: {
                    id: uuidGenerator(),
                    media: null,
                  },
                  rating: input.rating,
                  parent: null,
                  body: input.body || "",
                  editing: {
                    editableUntil: new Date(Date.now() + 10000).toISOString(),
                    edited: false,
                  },
                  actionCounts: {
                    reaction: {
                      total: 0,
                    },
                  },
                  tags,
                  viewerActionPresence: {
                    reaction: false,
                    dontAgree: false,
                    flag: false,
                  },
                  replies: {
                    edges: [],
                    viewNewEdges: [],
                    pageInfo: { endCursor: null, hasNextPage: false },
                  },
                  story: {
                    id: input.storyID,
                    settings: {
                      moderation: storySettings.moderation,
                      mode: storySettings.mode,
                      live: {
                        enabled: true,
                      },
                    },
                    viewerRating: null,
                    ratings: {
                      count: 0,
                      number: 0,
                    },
                  },
                  deleted: false,
                },
              },
              clientMutationId: (clientMutationId++).toString(),
            },
            // TODO: (kiwi/wyattjoh) fix types!
          } as any,
          optimisticUpdater: (store) => {
            // Skip optimistic update if comment is probably premoderated.
            if (expectPremoderation) {
              return;
            }
            sharedUpdater(environment, store, { ...input, tag });
            store.get(id)!.setValue(true, "pending");
          },
          updater: (store) => {
            sharedUpdater(environment, store, { ...input, tag });
          },
        }
      );
      createCommentEvent.success({
        id: result.edge.node.id,
        status: result.edge.node.status,
      });
      return result;
    } catch (error) {
      createCommentEvent.error({ message: error.message, code: error.code });
      throw error;
    }
  }
);
