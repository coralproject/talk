import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { SetUsernameMutation as MutationTypes } from "coral-admin/__generated__/SetUsernameMutation.graphql";

let clientMutationId = 0;

const SetUsernameMutation = createMutation(
  "setUsername",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation SetUsernameMutation($input: SetUsernameInput!) {
          setUsername(input: $input) {
            user {
              username
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

export default SetUsernameMutation;
