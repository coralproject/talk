import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
} from "coral-framework/lib/relay";

import {
  MarkCommentAsSeenMutation,
  MarkCommentSeenInput,
} from "coral-stream/__generated__/MarkCommentAsSeenMutation.graphql";

import {
  COMMIT_SEEN_EVENT,
  CommitSeenEventData,
} from "../commentSeen/CommentSeenContext";

const mutation = graphql`
  mutation MarkCommentAsSeenMutation($input: MarkCommentSeenInput!) {
    markCommentAsSeen(input: $input) {
      comment {
        id
        seen
      }
      clientMutationId
    }
  }
`;

type Input = Omit<MarkCommentSeenInput, "clientMutationId">;

const enhanced = createMutation(
  "markCommentAsSeen",
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
          commentID: input.commentID,
          clientMutationId: clientMutationId.toString(),
        },
      },
      optimisticResponse: {
        markCommentAsSeen: {
          comment: {
            id: input.commentID,
            seen: true,
          },
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });

    eventEmitter.emit(COMMIT_SEEN_EVENT, {
      commentID: input.commentID,
    } as CommitSeenEventData);

    return result;
  }
);

export default enhanced;
