import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { PromoteMemberMutation as MutationTypes } from "coral-admin/__generated__/PromoteMemberMutation.graphql";

let clientMutationId = 0;

const PromoteMemberMutation = createMutation(
  "promoteMember",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized(environment, {
      mutation: graphql`
        mutation PromoteMemberMutation($input: PromoteMemberInput!) {
          promoteMember(input: $input) {
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

export default PromoteMemberMutation;
