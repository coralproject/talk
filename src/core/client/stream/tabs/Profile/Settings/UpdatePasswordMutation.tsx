import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdatePasswordMutation as MutationTypes } from "coral-stream/__generated__/UpdatePasswordMutation.graphql";

let clientMutationId = 0;

const UpdatePasswordMutation = createMutation(
  "updatePassword",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UpdatePasswordMutation($input: UpdatePasswordInput!) {
          updatePassword(input: $input) {
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

export default UpdatePasswordMutation;
