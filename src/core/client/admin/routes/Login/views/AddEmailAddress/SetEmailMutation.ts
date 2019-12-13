import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { SetEmailMutation as MutationTypes } from "coral-admin/__generated__/SetEmailMutation.graphql";

let clientMutationId = 0;

const SetEmailMutation = createMutation(
  "setEmail",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation SetEmailMutation($input: SetEmailInput!) {
          setEmail(input: $input) {
            user {
              email
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

export default SetEmailMutation;
