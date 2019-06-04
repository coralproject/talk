import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { AcceptCommentMutation as MutationTypes } from "coral-stream/__generated__/AcceptCommentMutation.graphql";

let clientMutationId = 0;

const AcceptCommentMutation = createMutation(
  "acceptComment",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation AcceptCommentMutation($input: AcceptCommentInput!) {
          acceptComment(input: $input) {
            comment {
              status
            }
            clientMutationId
          }
        }
      `,
      optimisticResponse: {
        acceptComment: {
          comment: {
            status: "ACCEPTED",
          },
        },
      },
      variables: {
        input: {
          ...input,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
      updater: store => {
        store.get(input.commentID)!.setValue("ACCEPT", "lastViewerAction");
      },
    })
);

export default AcceptCommentMutation;
