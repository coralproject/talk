import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { PromoteUserMutation as MutationTypes } from "coral-admin/__generated__/PromoteUserMutation.graphql";

let clientMutationId = 0;

const PromoteUserMutation = createMutation(
  "promoteUser",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation PromoteUserMutation($input: PromoteUserInput!) {
          promoteUser(input: $input) {
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

export default PromoteUserMutation;
