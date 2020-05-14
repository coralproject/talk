import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DeleteExternalModerationPhaseMutation as MutationTypes } from "coral-admin/__generated__/DeleteExternalModerationPhaseMutation.graphql";

let clientMutationId = 0;

const DeleteExternalModerationPhaseMutation = createMutation(
  "deleteExternalModerationPhase",
  (environment: Environment, { id }: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DeleteExternalModerationPhaseMutation(
          $input: DeleteExternalModerationPhaseInput!
        ) {
          deleteExternalModerationPhase(input: $input) {
            phase {
              id
            }
          }
        }
      `,
      variables: {
        input: {
          id,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default DeleteExternalModerationPhaseMutation;
