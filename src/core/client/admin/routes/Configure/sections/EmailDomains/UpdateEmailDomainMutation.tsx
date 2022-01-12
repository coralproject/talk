import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateEmailDomainMutation as MutationTypes } from "coral-admin/__generated__/UpdateEmailDomainMutation.graphql";

let clientMutationId = 0;

const UpdateEmailDomainMutation = createMutation(
  "updateEmailDomain",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UpdateEmailDomainMutation($input: UpdateEmailDomainInput!) {
          updateEmailDomain(input: $input) {
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
          domain: input.domain,
          newUserModeration: input.newUserModeration,
          id: input.id,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default UpdateEmailDomainMutation;
