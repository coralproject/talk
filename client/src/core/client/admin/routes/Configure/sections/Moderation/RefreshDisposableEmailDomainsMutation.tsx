import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RefreshDisposableEmailDomainsMutation as MutationTypes } from "coral-admin/__generated__/RefreshDisposableEmailDomainsMutation.graphql";

let clientMutationId = 0;

const RefreshDisposableEmailDomainsMutation = createMutation(
  "refreshDisposableEmailDomains",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RefreshDisposableEmailDomainsMutation(
          $input: RefreshDisposableEmailDomainsInput!
        ) {
          refreshDisposableEmailDomains(input: $input) {
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

export default RefreshDisposableEmailDomainsMutation;
