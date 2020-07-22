import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { ReportCommentEvent } from "coral-stream/events";

import { CreateCommentDisagreeMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentDisagreeMutation.graphql";

let clientMutationId = 0;

const CreateCommentDisagreeMutation = createMutation(
  "createCommentDisagree",
  (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }
  ) => {
    const reportCommentEvent = ReportCommentEvent.begin(eventEmitter, {
      reason: "DONT_AGREE",
      additionalDetails: input.additionalDetails || undefined,
      commentID: input.commentID,
    });
    try {
      const result = commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation CreateCommentDisagreeMutation(
              $input: CreateCommentDontAgreeInput!
            ) {
              createCommentDontAgree(input: $input) {
                comment {
                  id
                  viewerActionPresence {
                    dontAgree
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

export default CreateCommentDisagreeMutation;
