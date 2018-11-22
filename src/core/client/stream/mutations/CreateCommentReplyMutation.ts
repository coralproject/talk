import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import { getMe } from "talk-framework/helpers";
import { TalkContext } from "talk-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";
import { CreateCommentReplyMutation as MutationTypes } from "talk-stream/__generated__/CreateCommentReplyMutation.graphql";

import {
  incrementStoryCommentCounts,
  prependCommentEdgeToProfile,
} from "../helpers";

export type CreateCommentReplyInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
> & { local?: boolean };

function sharedUpdater(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: CreateCommentReplyInput
) {
  incrementStoryCommentCounts(store, input.storyID);
  prependCommentEdgeToProfile(
    environment,
    store,
    store.getRootField("createCommentReply")!.getLinkedRecord("edge")!
  );
  if (input.local) {
    addLocalCommentReplyToStory(store, input);
  } else {
    addCommentReplyToStory(store, input);
  }
}

/**
 * update integrates new comment into the CommentConnection.
 */
function addCommentReplyToStory(
  store: RecordSourceSelectorProxy,
  input: CreateCommentReplyInput
) {
  // Get the payload returned from the server.
  const payload = store.getRootField("createCommentReply")!;

  // Get the edge of the newly created comment.
  const newEdge = payload.getLinkedRecord("edge")!;

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
      ConnectionHandler.insertEdgeAfter(con, newEdge);
    }
  }
}

/**
 * localUpdate is like update but updates the `localReplies` endpoint.
 */
function addLocalCommentReplyToStory(
  store: RecordSourceSelectorProxy,
  input: CreateCommentReplyInput
) {
  // Get the payload returned from the server.
  const payload = store.getRootField("createCommentReply")!;

  // Get the edge of the newly created comment.
  const newEdge = payload.getLinkedRecord("edge")!;
  const newComment = newEdge.getLinkedRecord("node");

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

const mutation = graphql`
  mutation CreateCommentReplyMutation($input: CreateCommentReplyInput!) {
    createCommentReply(input: $input) {
      edge {
        cursor
        node {
          ...StreamContainer_comment @relay(mask: false)
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
  { uuidGenerator }: TalkContext
) {
  const me = getMe(environment)!;
  const currentDate = new Date().toISOString();
  const id = uuidGenerator();
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
) => Promise<MutationTypes["response"]["createCommentReply"]>;
