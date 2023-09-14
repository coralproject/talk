import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { PromoteModeratorMutation as MutationTypes } from "coral-admin/__generated__/PromoteModeratorMutation.graphql";

let clientMutationId = 0;

const PromoteModeratorMutation = createMutation(
  "promoteModerator",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation PromoteModeratorMutation($input: PromoteModeratorInput!) {
          promoteModerator(input: $input) {
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

export default PromoteModeratorMutation;
