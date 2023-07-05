import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { SetPasswordMutation as MutationTypes } from "coral-admin/__generated__/SetPasswordMutation.graphql";

let clientMutationId = 0;

const SetPasswordMutation = createMutation(
  "setPassword",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation SetPasswordMutation($input: SetPasswordInput!) {
          setPassword(input: $input) {
            user {
              profiles {
                __typename
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

export default SetPasswordMutation;
