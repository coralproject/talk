import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
} from "coral-framework/lib/relay";

import {
  MarkCommentsAsSeenInput,
  MarkCommentsAsSeenMutation,
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

const enhanced = createMutation(
  "markCommentsAsSeen",
  async (
    environment: Environment,
    input: Input,
    { eventEmitter }: CoralContext
  ) => {
    let clientMutationId = 0;
    const result = await commitMutationPromiseNormalized<
      MarkCommentsAsSeenMutation
    >(environment, {
      mutation,
      variables: {
        input: {
          storyID: input.storyID,
          commentIDs: input.commentIDs,
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
    });

    if (input.commentIDs && input.commentIDs.length > 0) {
      eventEmitter.emit(COMMIT_SEEN_EVENT, {
        commentIDs: input.commentIDs,
      } as CommitSeenEventData);
    }

    return result;
  }
);

export default enhanced;
