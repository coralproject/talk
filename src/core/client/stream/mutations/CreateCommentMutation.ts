import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import { getMe, getMeSourceID } from "talk-framework/helpers";
import { TalkContext } from "talk-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";

import { CreateCommentMutation as MutationTypes } from "talk-stream/__generated__/CreateCommentMutation.graphql";

export type CreateCommentInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
> & { local?: boolean };

function sharedUpdater(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: CreateCommentInput
) {
  updateStory(store, input);
  if (input.local) {
    localUpdate(store, input);
  } else {
    update(store, input);
  }
  updateProfile(environment, store, input);
}

function updateStory(
  store: RecordSourceSelectorProxy,
  input: CreateCommentInput
) {
  // Updating Comment Count
  const story = store.get(input.storyID);
  if (story) {
    const record = story.getLinkedRecord("commentCounts");
    if (record) {
      // TODO: when we have moderation, we'll need to be careful here.
      const currentCount = record.getValue("totalVisible");
      record.setValue(currentCount + 1, "totalVisible");
    }
  }
}

/**
 * update integrates new comment into the CommentConnection.
 */
function update(store: RecordSourceSelectorProxy, input: CreateCommentInput) {
  // Get the payload returned from the server.
  const payload = store.getRootField("createComment")!;

  // Get the edge of the newly created comment.
  const newEdge = payload.getLinkedRecord("edge")!;

  // Get parent proxy.
  const parentProxy = input.parentID
    ? store.get(input.parentID)
    : store.get(input.storyID);

  const connectionKey = input.parentID
    ? "ReplyList_replies"
    : "Stream_comments";

  const filters = input.parentID
    ? { orderBy: "CREATED_AT_ASC" }
    : { orderBy: "CREATED_AT_DESC" };

  const where = input.parentID ? "append" : "prepend";

  if (parentProxy) {
    const con = ConnectionHandler.getConnection(
      parentProxy,
      connectionKey,
      filters
    );
    if (con) {
      if (where === "prepend") {
        ConnectionHandler.insertEdgeBefore(con, newEdge);
      } else {
        ConnectionHandler.insertEdgeAfter(con, newEdge);
      }
    }
  }
}

/**
 * localUpdate is like update but updates the `localReplies` endpoint.
 */
function localUpdate(
  store: RecordSourceSelectorProxy,
  input: CreateCommentInput
) {
  // Get the payload returned from the server.
  const payload = store.getRootField("createComment")!;

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

/**
 * updateProfile integrates new comment into the profile.
 */
function updateProfile(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: CreateCommentInput
) {
  // Get the payload returned from the server.
  const payload = store.getRootField("createComment")!;

  // Get the edge of the newly created comment.
  const newEdge = payload.getLinkedRecord("edge")!;

  const meProxy = store.get(getMeSourceID(environment)!);
  const con = ConnectionHandler.getConnection(
    meProxy,
    "CommentHistory_comments"
  );
  // Note: Currently this is always null, until Relay comes
  // with better data retaintion and data from store support.
  if (con) {
    ConnectionHandler.insertEdgeBefore(con, newEdge);
  }
}

const mutation = graphql`
  mutation CreateCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
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
  input: CreateCommentInput,
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
        body: input.body,
        clientMutationId: clientMutationId.toString(),
      },
    },
    optimisticResponse: {
      createComment: {
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

export const withCreateCommentMutation = createMutationContainer(
  "createComment",
  commit
);

export type CreateCommentMutation = (
  input: CreateCommentInput
) => Promise<MutationTypes["response"]["createComment"]>;
