import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { InviteUsersMutation } from "coral-admin/__generated__/InviteUsersMutation.graphql";

let clientMutationId = 0;

const InviteUsersMutation = createMutation(
  "inviteUsers",
  (environment: Environment, input: MutationInput<InviteUsersMutation>) =>
    commitMutationPromiseNormalized<InviteUsersMutation>(environment, {
      mutation: graphql`
        mutation InviteUsersMutation($input: InviteUsersInput!) {
          inviteUsers(input: $input) {
            clientMutationId
            invites {
              id
              email
            }
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

export default InviteUsersMutation;
