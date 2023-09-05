import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { BanDomainMutation } from "coral-admin/__generated__/BanDomainMutation.graphql";
import { GQLNEW_USER_MODERATION } from "coral-framework/schema";

type MutationTypes = Omit<
  MutationInput<BanDomainMutation>,
  "newUserModeration"
>;
let clientMutationId = 0;

const BanDomainMutation = createMutation(
  "banDomain",
  (environment: Environment, input: MutationTypes) => {
    return commitMutationPromiseNormalized<BanDomainMutation>(environment, {
      mutation: graphql`
        mutation BanDomainMutation($input: CreateEmailDomainInput!) {
          createEmailDomain(input: $input) {
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          domain: input.domain,
          newUserModeration: GQLNEW_USER_MODERATION.BAN,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
  }
);

export default BanDomainMutation;
