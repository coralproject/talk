import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "talk-framework/lib/relay";

import { SetEmailMutation as MutationTypes } from "talk-admin/__generated__/SetEmailMutation.graphql";

export type SetEmailInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation SetEmailMutation($input: SetEmailInput!) {
    setEmail(input: $input) {
      user {
        email
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: SetEmailInput) {
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

export const withSetEmailMutation = createMutationContainer("setEmail", commit);

export type SetEmailMutation = (
  input: SetEmailInput
) => MutationResponsePromise<MutationTypes, "setEmail">;
