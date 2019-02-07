import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import { getMe } from "talk-framework/helpers";
import { TalkContext } from "talk-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "talk-framework/lib/relay";
import { CreateCommentReplyMutation as MutationTypes } from "talk-stream/__generated__/CreateCommentReplyMutation.graphql";

import {
  incrementStoryCommentCounts,
  isInReview,
  isRejected,
  isRolePriviledged,
  prependCommentEdgeToProfile,
} from "../helpers";

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

  // If comment is in review or has been rejected, we don't need to add it.
  if (isInReview(status) || isRejected(status)) {
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
    moderation
  }
  fragment CreateCommentReplyMutation_me on User {
    role
  }
`;
/** end */
const mutation = graphql`
  mutation CreateCommentReplyMutation($input: CreateCommentReplyInput!) {
    createCommentReply(input: $input) {
      edge {
        cursor
        node {
          ...StreamContainer_comment @relay(mask: false)
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
  { uuidGenerator, relayEnvironment }: TalkContext
) {
  const me = getMe(environment)!;
  const currentDate = new Date().toISOString();
  const id = uuidGenerator();

  const story = relayEnvironment
    .getStore()
    .getSource()
    .get(input.storyID);
  if (!story || !story.moderation) {
    throw new Error("Moderation mode of the story was not included");
  }

  // TODO: Generate and use schema types.
  const alwaysPremoderated =
    !isRolePriviledged(me.role) && story.moderation === "PRE";

  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        storyID: input.storyID,
        parentID: input.parentID,
        parentRevisionID: input.parentRevisionID,
        body: input.body,
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
            author: {
              id: me.id,
              username: me.username,
            },
            body: input.body,
            editing: {
              editableUntil: new Date(Date.now() + 10000),
            },
            actionCounts: {
              reaction: {
                total: 0,
              },
            },
          },
        },
        clientMutationId: (clientMutationId++).toString(),
      },
    } as any, // TODO: (cvle) generated types should contain one for the optimistic response.
    optimisticUpdater: store => {
      // Skip if comments are always moderated.
      if (alwaysPremoderated) {
        return;
      }
      sharedUpdater(environment, store, input);
      store.get(id)!.setValue(true, "pending");
    },
    updater: store => {
      // Skip if comments are always moderated.
      if (alwaysPremoderated) {
        return;
      }
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
