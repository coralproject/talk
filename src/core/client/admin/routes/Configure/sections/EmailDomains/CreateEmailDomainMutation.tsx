import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { CreateEmailDomainMutation as MutationTypes } from "coral-admin/__generated__/CreateEmailDomainMutation.graphql";

let clientMutationId = 0;

const CreateEmailDomainMutation = createMutation(
  "createEmailDomain",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation CreateEmailDomainMutation($input: CreateEmailDomainInput!) {
          createEmailDomain(input: $input) {
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
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default CreateEmailDomainMutation;
