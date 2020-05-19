import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RotateExternalModerationPhaseSigningSecretMutation as MutationTypes } from "coral-admin/__generated__/RotateExternalModerationPhaseSigningSecretMutation.graphql";

let clientMutationId = 0;

const RotateExternalModerationPhaseSigningSecretMutation = createMutation(
  "rotateExternalModerationPhaseSigningSecret",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RotateExternalModerationPhaseSigningSecretMutation(
          $input: RotateExternalModerationPhaseSigningSecretInput!
        ) {
          rotateExternalModerationPhaseSigningSecret(input: $input) {
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

export default RotateExternalModerationPhaseSigningSecretMutation;
