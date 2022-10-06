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

import {
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

const updateCommentsAndRepliesToSeen = (
  comments: RecordProxy[],
  store: RecordSourceSelectorProxy<MarkCommentsAsSeenMutationResponse>,
  input: Input
) => {
  for (const comment of comments) {
    const commentID = comment.getLinkedRecord("node")?.getValue("id");
    if (commentID) {
      const proxy = store.get(commentID.toString());
      if (proxy) {
        proxy.setValue(!!input.updateSeen, "seen");
        const allChildCommentsEdges =
          proxy
            .getLinkedRecord("allChildComments")
            ?.getLinkedRecords("edges") || [];
        for (const reply of allChildCommentsEdges) {
          const replyID = reply.getLinkedRecord("node")?.getValue("id");
          if (replyID) {
            const replyProxy = store.get(replyID.toString());
            if (replyProxy) {
              replyProxy.setValue(!!input.updateSeen, "seen");
            }
          }
        }
      }
    }
  }
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
              const story = store.get(input.storyID)!;
              const connection = ConnectionHandler.getConnection(
                story,
                "Stream_comments",
                {
                  orderBy: input.orderBy,
                }
              )!;
              const comments = connection?.getLinkedRecords("edges");
              const newComments =
                connection?.getLinkedRecords("viewNewEdges") || [];
              const combinedComments = comments?.concat(newComments);
              if (combinedComments) {
                updateCommentsAndRepliesToSeen(combinedComments, store, input);
              }
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
