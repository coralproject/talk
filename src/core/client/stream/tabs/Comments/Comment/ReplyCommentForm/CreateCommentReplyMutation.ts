import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import { roleIsAtLeast } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  lookup,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";
import { GQLComment, GQLStory, GQLUSER_ROLE } from "coral-framework/schema";
import { CreateCommentReplyMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentReplyMutation.graphql";

import { pick } from "lodash";
import {
  incrementStoryCommentCounts,
  isVisible,
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

  // If comment is not visible, we don't need to add it.
  if (!isVisible(status)) {
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
  const parentProxy = store.get(input.parentID!);

  if (parentProxy) {
    const localReplies = parentProxy.getLinkedRecords("localReplies");
    const nextLocalReplies = localReplies
      ? localReplies.concat(newComment)
      : [newComment];
    parentProxy.setLinkedRecords(nextLocalReplies, "localReplies");
  }
}

/** These are needed to be included when querying for the stream. */
// tslint:disable-next-line:no-unused-expression
graphql`
  fragment CreateCommentReplyMutation_story on Story {
    settings {
      moderation
    }
  }
`;
// tslint:disable-next-line:no-unused-expression
graphql`
  fragment CreateCommentReplyMutation_viewer on User {
    role
    createdAt
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

function commit(
  environment: Environment,
  input: CreateCommentReplyInput,
  { uuidGenerator, relayEnvironment }: CoralContext
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

  return commitMutationPromiseNormalized<MutationTypes>(environment, {
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
  });
}

export const withCreateCommentReplyMutation = createMutationContainer(
  "createCommentReply",
  commit
);

export type CreateCommentReplyMutation = (
  input: CreateCommentReplyInput
) => MutationResponsePromise<MutationTypes, "createCommentReply">;
