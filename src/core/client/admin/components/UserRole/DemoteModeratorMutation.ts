import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DemoteModeratorMutation as MutationTypes } from "coral-admin/__generated__/DemoteModeratorMutation.graphql";

let clientMutationId = 0;

const DemoteModeratorMutation = createMutation(
  "demoteModerator",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DemoteModeratorMutation($input: DemoteModeratorInput!) {
          demoteModerator(input: $input) {
            user {
              id
              role
              moderationScopes {
                scoped
                sites {
                  id
                  name
                }
              }
            }
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

export default DemoteModeratorMutation;
