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

import { COMMIT_SEEN_EVENT, CommitSeenEventData } from "../commentSeen/";

const mutation = graphql`
  mutation MarkCommentAsSeenMutation($input: MarkCommentSeenInput!) {
    markCommentAsSeen(input: $input) {
      comments {
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
          commentIDs: input.commentIDs,
          clientMutationId: clientMutationId.toString(),
        },
      },
      optimisticResponse: {
        markCommentAsSeen: {
          comments: [
            {
              id: input.commentIDs[0],
              seen: true,
            },
          ],
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
