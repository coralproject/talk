import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateExternalModerationPhaseMutation as MutationTypes } from "coral-admin/__generated__/UpdateExternalModerationPhaseMutation.graphql";

let clientMutationId = 0;

const UpdateExternalModerationPhaseMutation = createMutation(
  "updateExternalModerationPhase",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UpdateExternalModerationPhaseMutation(
          $input: UpdateExternalModerationPhaseInput!
        ) {
          updateExternalModerationPhase(input: $input) {
            phase {
              ...ConfigureExternalModerationPhaseContainer_phase
            }
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

export default UpdateExternalModerationPhaseMutation;
