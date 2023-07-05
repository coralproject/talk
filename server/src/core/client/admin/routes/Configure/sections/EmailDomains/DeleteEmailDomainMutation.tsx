import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DeleteEmailDomainMutation as MutationTypes } from "coral-admin/__generated__/DeleteEmailDomainMutation.graphql";

let clientMutationId = 0;

const DeleteEmailDomainMutation = createMutation(
  "deleteEmailDomain",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DeleteEmailDomainMutation($input: DeleteEmailDomainInput!) {
          deleteEmailDomain(input: $input) {
            settings {
              emailDomainModeration {
                id
                domain
                newUserModeration
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          id: input.id,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default DeleteEmailDomainMutation;
