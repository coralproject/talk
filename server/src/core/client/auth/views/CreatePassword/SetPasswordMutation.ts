import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
} from "coral-framework/lib/relay";

import { SetPasswordMutation as MutationTypes } from "coral-auth/__generated__/SetPasswordMutation.graphql";

export type SetPasswordInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
>;

const mutation = graphql`
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
`;

let clientMutationId = 0;

function commit(environment: Environment, input: SetPasswordInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        password: input.password,
        clientMutationId: (clientMutationId++).toString(),
      },
    },
  });
}

const SetPasswordMutation = createMutation("setPassword", commit);

export default SetPasswordMutation;
