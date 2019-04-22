import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { SetPasswordMutation as MutationTypes } from "talk-admin/__generated__/SetPasswordMutation.graphql";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "talk-framework/lib/relay";

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
