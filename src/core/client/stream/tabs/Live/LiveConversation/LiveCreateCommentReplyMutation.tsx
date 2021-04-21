import { pick } from "lodash";
import { Environment, graphql } from "react-relay";
import { ConnectionHandler, RecordSourceSelectorProxy } from "relay-runtime";
import { getConnection } from "relay-runtime/lib/handlers/connection/ConnectionHandler";

import { getViewer, roleIsAtLeast } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLComment, GQLStory, GQLUSER_ROLE } from "coral-framework/schema";
import { CreateCommentReplyEvent } from "coral-stream/events";

import { LiveCreateCommentReplyMutation as MutationTypes } from "coral-stream/__generated__/LiveCreateCommentReplyMutation.graphql";
import { LiveCreateCommentReplyMutation_viewer } from "coral-stream/__generated__/LiveCreateCommentReplyMutation_viewer.graphql";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment LiveCreateCommentReplyMutation_story on Story {
    settings {
      moderation
    }
  }
`;
// eslint-disable-next-line no-unused-expressions
graphql`
  fragment LiveCreateCommentReplyMutation_viewer on User {
    id
    username
    bio
    avatar
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

export type LiveCreateCommentReplyInput = Omit<
  MutationInput<MutationTypes>,
  "flattenReplies"
> & {
  local?: boolean;
};

const mutation = graphql`
  mutation LiveCreateCommentReplyMutation($input: CreateCommentReplyInput!) {
    createCommentReply(input: $input) {
      edge {
        cursor
        node {
          ...LiveReplyContainer_comment
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
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function insertIntoLiveChat(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: LiveCreateCommentReplyInput
) {
  const commentEdge = store
    .getRootField("createCommentReply")!
    .getLinkedRecord("edge")!;

  if (!commentEdge) {
    return;
  }

  const node = commentEdge.getLinkedRecord("node");
  commentEdge.setValue(node!.getValue("createdAt"), "cursor");

  const streamProxy = store.get(input.storyID)!;
  const connectionKey = "Chat_after";

  const connection = getConnection(streamProxy, connectionKey);

  if (connection) {
    ConnectionHandler.insertEdgeAfter(connection, commentEdge);
  }
}

function insertIntoReplyChat(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: LiveCreateCommentReplyInput
) {
  const commentEdge = store
    .getRootField("createCommentReply")!
    .getLinkedRecord("edge")!;

  if (!commentEdge) {
    return;
  }

  commentEdge.setValue(new Date().toISOString(), "cursor");

  const connectionKey = "Replies_after";
  const comment = commentEdge.getLinkedRecord("node")!;
  const parent = comment.getLinkedRecord("parent")!;

  const connection = getConnection(parent, connectionKey);

  if (connection) {
    ConnectionHandler.insertEdgeAfter(connection, commentEdge);
  }
}

function sharedUpdater(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: LiveCreateCommentReplyInput
) {
  insertIntoLiveChat(environment, store, input);
  insertIntoReplyChat(environment, store, input);
}

async function commit(
  environment: Environment,
  input: LiveCreateCommentReplyInput,
  { uuidGenerator, relayEnvironment, eventEmitter }: CoralContext
) {
  const parentComment = lookup<GQLComment>(environment, input.parentID)!;
  const viewer = getViewer<LiveCreateCommentReplyMutation_viewer>(environment)!;
  const currentDate = new Date().toISOString();
  const id = uuidGenerator();
  const storySettings = lookup<GQLStory>(relayEnvironment, input.storyID)!
    .settings;
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
    // TODO: use correct optimistic response.
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
        },
        optimisticResponse: {
          createCommentReply: {
            edge: {
              cursor: currentDate,
              node: {
                id,
                createdAt: currentDate,
                status: "NONE",
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
                parent: {
                  createdAt: parentComment.createdAt,
                  id: parentComment.id,
                  author: parentComment.author
                    ? pick(parentComment.author, "username", "id")
                    : null,
                  body: parentComment.body,
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
                  settings: {
                    live: {
                      enabled: storySettings.live.enabled,
                    },
                  },
                },
                site: {
                  id: uuidGenerator(),
                },
                replyCount: 0,
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
          sharedUpdater(environment, store, input);
          store.get(id)!.setValue(true, "pending");
        },
        updater: (store) => {
          sharedUpdater(environment, store, input);
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

export const LiveCreateCommentReplyMutation = createMutation(
  "liveCreateCommentReply",
  commit
);
