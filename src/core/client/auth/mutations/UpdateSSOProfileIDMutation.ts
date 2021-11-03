import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateSSOProfileIDMutation as MutationTypes } from "coral-auth/__generated__/UpdateSSOProfileIDMutation.graphql";

let clientMutationId = 0;

const UpdateSSOProfileIDMutation = createMutation(
  "updateSSOProfileID",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UpdateSSOProfileIDMutation($input: UpdateSSOProfileIDInput!) {
          updateSSOProfileID(input: $input) {
            user {
              id
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          userID: input.userID,
          SSOProfileID: input.SSOProfileID,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
  }
);

export default UpdateSSOProfileIDMutation;
