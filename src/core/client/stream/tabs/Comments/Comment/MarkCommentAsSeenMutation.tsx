import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
} from "coral-framework/lib/relay";

import {
  MarkCommentAsSeenMutation,
  MarkCommentSeenInput,
} from "coral-stream/__generated__/MarkCommentAsSeenMutation.graphql";

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
  async (environment: Environment, input: Input) => {
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
    return result;
  }
);

export default enhanced;
