import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { SetUsernameMutation as MutationTypes } from "talk-admin/__generated__/SetUsernameMutation.graphql";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "talk-framework/lib/relay";

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
