import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { SetEmailMutation as MutationTypes } from "talk-admin/__generated__/SetEmailMutation.graphql";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "talk-framework/lib/relay";

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
