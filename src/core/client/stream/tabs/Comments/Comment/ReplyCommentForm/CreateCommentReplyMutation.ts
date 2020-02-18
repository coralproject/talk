import { pick } from "lodash";
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
  createMutationContainer,
  lookup,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";
import { GQLComment, GQLStory, GQLUSER_ROLE } from "coral-framework/schema";
import { CreateCommentReplyEvent } from "coral-stream/events";

import { CreateCommentReplyMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentReplyMutation.graphql";

import {
  incrementStoryCommentCounts,
  isPublished,
  prependCommentEdgeToProfile,
} from "../../helpers";

export type CreateCommentReplyInput = MutationInput<MutationTypes> & {
  local?: boolean;
};

function sharedUpdater(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: CreateCommentReplyInput
) {
  const commentEdge = store
    .getRootField("createCommentReply")!
    .getLinkedRecord("edge")!;
  const status = commentEdge.getLinkedRecord("node")!.getValue("status");

  // If comment is not published, we don't need to add it.
  if (!isPublished(status)) {
    return;
  }

  incrementStoryCommentCounts(store, input.storyID);
  prependCommentEdgeToProfile(environment, store, commentEdge);
  if (input.local) {
    addLocalCommentReplyToStory(store, input, commentEdge);
  } else {
    addCommentReplyToStory(store, input, commentEdge);
  }
}

/**
 * update integrates new comment into the CommentConnection.
 */
function addCommentReplyToStory(
  store: RecordSourceSelectorProxy,
  input: CreateCommentReplyInput,
  commentEdge: RecordProxy
) {
  // Get parent proxy.
  const parentProxy = store.get(input.parentID);
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
  const newComment = commentEdge.getLinkedRecord("node");

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
  mutation CreateCommentReplyMutation($input: CreateCommentReplyInput!) {
    createCommentReply(input: $input) {
      edge {
        cursor
        node {
          ...AllCommentsTabContainer_comment @relay(mask: false)
          status
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
    const result = await commitMutationPromiseNormalized<MutationTypes>(
      environment,
      {
        mutation,
        variables: {
          input: {
            storyID: input.storyID,
            parentID: input.parentID,
            parentRevisionID: input.parentRevisionID,
            body: input.body,
            nudge: input.nudge,
            clientMutationId: clientMutationId.toString(),
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
                  username: viewer.username,
                  createdAt: viewer.createdAt,
                  badges: viewer.badges,
                  ignoreable: false,
                },
                body: input.body,
                revision: {
                  id: uuidGenerator(),
                },
                parent: {
                  id: parentComment.id,
                  author: parentComment.author
                    ? pick(parentComment.author, "username", "id")
                    : null,
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
                replies: {
                  edges: [],
                  pageInfo: { endCursor: null, hasNextPage: false },
                },
                deleted: false,
              },
            },
            clientMutationId: (clientMutationId++).toString(),
          },
        },
        optimisticUpdater: store => {
          // Skip optimistic update if comment is probably premoderated.
          if (expectPremoderation) {
            return;
          }
          sharedUpdater(environment, store, input);
          store.get(id)!.setValue(true, "pending");
        },
        updater: store => {
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

export const withCreateCommentReplyMutation = createMutationContainer(
  "createCommentReply",
  commit
);

export type CreateCommentReplyMutation = (
  input: CreateCommentReplyInput
) => MutationResponsePromise<MutationTypes, "createCommentReply">;
