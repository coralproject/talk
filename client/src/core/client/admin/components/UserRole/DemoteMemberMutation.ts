import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DemoteMemberMutation as MutationTypes } from "coral-admin/__generated__/DemoteMemberMutation.graphql";

let clientMutationId = 0;

const DemoteMemberMutation = createMutation(
  "demoteMember",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized(environment, {
      mutation: graphql`
        mutation DemoteMemberMutation($input: DemoteMemberInput!) {
          demoteMember(input: $input) {
            user {
              id
              role
              membershipScopes {
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

export default DemoteMemberMutation;
