import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RollWebhookEndpointSecretMutation as MutationTypes } from "coral-admin/__generated__/RollWebhookEndpointSecretMutation.graphql";

let clientMutationId = 0;

const RollWebhookEndpointSecretMutation = createMutation(
  "rollWebhookEndpointSecret",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RollWebhookEndpointSecretMutation(
          $input: RollWebhookEndpointSecretInput!
        ) {
          rollWebhookEndpointSecret(input: $input) {
            endpoint {
              ...ConfigureWebhookContainer_webhookEndpoint
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

export default RollWebhookEndpointSecretMutation;
