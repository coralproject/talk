import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { EnableExternalModerationPhaseMutation as MutationTypes } from "coral-admin/__generated__/EnableExternalModerationPhaseMutation.graphql";

let clientMutationId = 0;

const EnableExternalModerationPhaseMutation = createMutation(
  "enableExternalModerationPhase",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation EnableExternalModerationPhaseMutation(
          $input: EnableExternalModerationPhaseInput!
        ) {
          enableExternalModerationPhase(input: $input) {
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

export default EnableExternalModerationPhaseMutation;
