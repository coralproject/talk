import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";

import {
  COMMENT_SORT,
  MarkCommentsAsSeenInput,
  MarkCommentsAsSeenMutation,
  MarkCommentsAsSeenMutationResponse,
} from "coral-stream/__generated__/MarkCommentsAsSeenMutation.graphql";

import { COMMIT_SEEN_EVENT, CommitSeenEventData } from "../commentSeen";

const mutation = graphql`
  mutation MarkCommentsAsSeenMutation($input: MarkCommentsAsSeenInput!) {
    markCommentsAsSeen(input: $input) {
      comments {
        id
        seen
      }
      clientMutationId
    }
  }
`;
type Input = Omit<MarkCommentsAsSeenInput, "clientMutationId"> & {
  updateSeen: boolean;
};

const getReplies = (commentProxy: RecordProxy<{}>) => {
  const repliesConnection = ConnectionHandler.getConnection(
    commentProxy,
    "ReplyList_replies",
    { orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC }
  )!;

  if (!repliesConnection) {
    return [];
  }

  const allEdges: RecordProxy<{}>[] = [];

  const edges = repliesConnection.getLinkedRecords("edges");
  if (edges && edges.length > 0) {
    allEdges.push(...edges);
  }
  const viewNewEdges = repliesConnection.getLinkedRecords("viewNewEdges");
  if (viewNewEdges && viewNewEdges.length > 0) {
    allEdges.push(...viewNewEdges);
  }

  if (!allEdges || allEdges.length === 0) {
    return [];
  }

  const childComments = allEdges.map((e) => e.getLinkedRecord("node")) || [];
  if (!childComments || childComments.length === 0) {
    return [];
  }

  return childComments;
};

const getKeyboardShorcutReplies = (commentProxy: RecordProxy<{}>) => {
  const allChildComments = commentProxy.getLinkedRecord("allChildComments");
  if (!allChildComments) {
    return [];
  }

  const allEdges: RecordProxy<{}>[] = [];

  const edges = allChildComments.getLinkedRecords("edges") || [];
  if (edges && edges.length > 0) {
    allEdges.push(...edges);
  }

  const viewNewEdges = allChildComments.getLinkedRecords("viewNewEdges") || [];
  if (viewNewEdges && viewNewEdges.length > 0) {
    allEdges.push(...viewNewEdges);
  }

  if (!allEdges || allEdges.length === 0) {
    return [];
  }

  const childComments = allEdges.map((e) => e.getLinkedRecord("node")) || [];
  if (!childComments || childComments.length === 0) {
    return [];
  }

  return childComments;
};

const markAllAsSeenRecursive = (
  store: RecordSourceSelectorProxy<MarkCommentsAsSeenMutationResponse>,
  comments: (RecordProxy<{}> | null)[],
  seen: boolean
) => {
  if (!comments || comments.length === 0) {
    return;
  }

  for (const comment of comments) {
    if (!comment) {
      continue;
    }

    const commentID = comment.getValue("id");
    if (!commentID) {
      continue;
    }

    const c = store.get(commentID.toString());
    if (!c) {
      continue;
    }

    c.setValue(seen, "seen");

    const replies = getReplies(c);
    const keyboardShortcutReplies = getKeyboardShorcutReplies(c);

    markAllAsSeenRecursive(
      store,
      [...replies, ...keyboardShortcutReplies],
      seen
    );
  }
};

const markAllAsSeen = (
  store: RecordSourceSelectorProxy<MarkCommentsAsSeenMutationResponse>,
  storyID: string,
  orderBy: COMMENT_SORT | null | undefined,
  seen: boolean
) => {
  const story = store.get(storyID);
  if (!story) {
    return;
  }

  const connection = ConnectionHandler.getConnection(story, "Stream_comments", {
    orderBy: orderBy,
  });
  if (!connection) {
    return;
  }

  const allEdges: RecordProxy<{}>[] = [];

  const edges = connection.getLinkedRecords("edges");
  if (edges && edges.length > 0) {
    allEdges.push(...edges);
  }
  const viewNewEdges = connection.getLinkedRecords("viewNewEdges");
  if (viewNewEdges && viewNewEdges.length > 0) {
    allEdges.push(...viewNewEdges);
  }

  if (!allEdges || allEdges.length === 0) {
    return;
  }

  const comments = allEdges.map((e) => e.getLinkedRecord("node"));
  if (!comments) {
    return;
  }

  markAllAsSeenRecursive(store, comments, seen);
};

const enhanced = createMutation(
  "markCommentsAsSeen",
  async (
    environment: Environment,
    input: Input,
    { eventEmitter }: CoralContext
  ) => {
    let clientMutationId = 0;
    const result =
      await commitMutationPromiseNormalized<MarkCommentsAsSeenMutation>(
        environment,
        {
          mutation,
          variables: {
            input: {
              storyID: input.storyID,
              commentIDs: input.commentIDs,
              markAllAsSeen: input.markAllAsSeen,
              updateSeen: input.updateSeen,
              orderBy: input.orderBy,
              clientMutationId: clientMutationId.toString(),
            },
          },
          optimisticResponse: {
            markCommentsAsSeen: {
              comments: input.commentIDs.map((id) => {
                return { id, seen: input.updateSeen ? true : false };
              }),
              clientMutationId: (clientMutationId++).toString(),
            },
          },
          updater: (store, data) => {
            if (input.markAllAsSeen) {
              markAllAsSeen(
                store,
                input.storyID,
                input.orderBy,
                input.updateSeen
              );
            }

            if (
              !data.markCommentsAsSeen ||
              !data.markCommentsAsSeen.comments ||
              data.markCommentsAsSeen.comments.length === 0
            ) {
              return;
            }
            for (const comment of data.markCommentsAsSeen.comments) {
              const proxy = store.get(comment.id);
              if (proxy) {
                proxy.setValue(!!input.updateSeen, "seen");
              }
            }
          },
        }
      );
    if (
      input.markAllAsSeen ||
      (input.commentIDs && input.commentIDs.length > 0)
    ) {
      eventEmitter.emit(COMMIT_SEEN_EVENT, {
        commentIDs: input.commentIDs,
      } as CommitSeenEventData);
    }
    return result;
  }
);
export default enhanced;
