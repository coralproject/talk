import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
} from "coral-framework/lib/relay";

import {
  MarkCommentAsSeenMutation,
  MarkCommentsAsSeenInput,
} from "coral-stream/__generated__/MarkCommentAsSeenMutation.graphql";

import { COMMIT_SEEN_EVENT, CommitSeenEventData } from "../commentSeen/";

const mutation = graphql`
  mutation MarkCommentAsSeenMutation($input: MarkCommentsAsSeenInput!) {
    markCommentsAsSeen(input: $input) {
      comments {
        id
        seen
      }
      clientMutationId
    }
  }
`;

type Input = Omit<MarkCommentsAsSeenInput, "clientMutationId">;

const enhanced = createMutation(
  "markCommentsAsSeen",
  async (
    environment: Environment,
    input: Input,
    { eventEmitter }: CoralContext
  ) => {
    let clientMutationId = 0;
    const result = await commitMutationPromiseNormalized<
      MarkCommentAsSeenMutation
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
            return { id, seen: true };
          }),
          clientMutationId: (clientMutationId++).toString(),
        },
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
