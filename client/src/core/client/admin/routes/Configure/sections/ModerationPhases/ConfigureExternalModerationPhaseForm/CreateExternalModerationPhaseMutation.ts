import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { CreateExternalModerationPhaseMutation as MutationTypes } from "coral-admin/__generated__/CreateExternalModerationPhaseMutation.graphql";

let clientMutationId = 0;

const CreateExternalModerationPhaseMutation = createMutation(
  "createExternalModerationPhase",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation CreateExternalModerationPhaseMutation(
          $input: CreateExternalModerationPhaseInput!
        ) {
          createExternalModerationPhase(input: $input) {
            phase {
              id
            }
            settings {
              ...ModerationPhasesConfigContainer_settings
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

export default CreateExternalModerationPhaseMutation;
