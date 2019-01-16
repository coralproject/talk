import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";

import { SetUsernameMutation as MutationTypes } from "talk-admin/__generated__/SetUsernameMutation.graphql";

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

export const withSetUsernameMutation = createMutationContainer(
  "setUsername",
  commit
);

export type SetUsernameMutation = (
  input: SetUsernameInput
) => Promise<MutationTypes["response"]["setUsername"]>;
