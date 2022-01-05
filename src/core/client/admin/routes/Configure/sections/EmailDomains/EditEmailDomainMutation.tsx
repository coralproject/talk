import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { EditEmailDomainMutation as MutationTypes } from "coral-admin/__generated__/EditEmailDomainMutation.graphql";

let clientMutationId = 0;

const EditEmailDomainMutation = createMutation(
  "editEmailDomain",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation EditEmailDomainMutation($input: EditEmailDomainInput!) {
          editEmailDomain(input: $input) {
            settings {
              emailDomains {
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

export default EditEmailDomainMutation;
