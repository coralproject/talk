import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { ReportCommentEvent } from "coral-stream/events";

import { CreateCommentFlagMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentFlagMutation.graphql";

let clientMutationId = 0;

const CreateCommentFlagMutation = createMutation(
  "createCommentFlag",
  (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }
  ) => {
    const reportCommentEvent = ReportCommentEvent.begin(eventEmitter, {
      reason: input.reason,
      commentID: input.commentID,
      additionalDetails: input.additionalDetails || undefined,
    });
    try {
      const result = commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation CreateCommentFlagMutation(
              $input: CreateCommentFlagInput!
            ) {
              createCommentFlag(input: $input) {
                comment {
                  id
                  viewerActionPresence {
                    flag
                  }
                }
                clientMutationId
              }
            }
          `,
          variables: {
            input: {
              commentID: input.commentID,
              commentRevisionID: input.commentRevisionID,
              reason: input.reason,
              additionalDetails: input.additionalDetails,
              clientMutationId: (clientMutationId++).toString(),
            },
          },
        }
      );
      reportCommentEvent.success();
      return result;
    } catch (error) {
      reportCommentEvent.error({ message: error.message, code: error.code });
      throw error;
    }
  }
);

export default CreateCommentFlagMutation;
