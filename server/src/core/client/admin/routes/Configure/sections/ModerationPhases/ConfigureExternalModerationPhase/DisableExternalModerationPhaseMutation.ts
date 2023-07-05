import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DisableExternalModerationPhaseMutation as MutationTypes } from "coral-admin/__generated__/DisableExternalModerationPhaseMutation.graphql";

let clientMutationId = 0;

const DisableExternalModerationPhaseMutation = createMutation(
  "disableExternalModerationPhase",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DisableExternalModerationPhaseMutation(
          $input: DisableExternalModerationPhaseInput!
        ) {
          disableExternalModerationPhase(input: $input) {
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

export default DisableExternalModerationPhaseMutation;
