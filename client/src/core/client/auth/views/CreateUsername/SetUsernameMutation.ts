import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
} from "coral-framework/lib/relay";

import { SetUsernameMutation as MutationTypes } from "coral-auth/__generated__/SetUsernameMutation.graphql";

export type SetUsernameInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
>;

const mutation = graphql`
  mutation SetUsernameMutation($input: SetUsernameInput!) {
    setUsername(input: $input) {
      user {
        username
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: SetUsernameInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId: (clientMutationId++).toString(),
      },
    },
  });
}

const SetUsernameMutation = createMutation("setUsername", commit);

export default SetUsernameMutation;
