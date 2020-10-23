import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DemoteUserMutation as MutationTypes } from "coral-admin/__generated__/DemoteUserMutation.graphql";

let clientMutationId = 0;

const DemoteUserMutation = createMutation(
  "demoteUser",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DemoteUserMutation($input: DemoteUserInput!) {
          demoteUser(input: $input) {
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

export default DemoteUserMutation;
