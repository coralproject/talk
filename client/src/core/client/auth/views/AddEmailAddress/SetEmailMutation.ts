import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
} from "coral-framework/lib/relay";

import { SetEmailMutation as MutationTypes } from "coral-auth/__generated__/SetEmailMutation.graphql";

export type SetEmailInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
>;

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

const SetEmailMutation = createMutation("setEmail", commit);

export default SetEmailMutation;
