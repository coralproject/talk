import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { RequestAccountDeletionMutation as MutationTypes } from "coral-stream/__generated__/RequestAccountDeletionMutation.graphql";

let clientMutationId = 0;

const RequestAccountDeletionMutation = createMutation(
  "requestAccountDeletion",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RequestAccountDeletionMutation(
          $input: RequestAccountDeletionInput!
        ) {
          requestAccountDeletion(input: $input) {
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          ...input,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default RequestAccountDeletionMutation;
