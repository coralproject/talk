import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RotateWebhookEndpointSecretMutation as MutationTypes } from "coral-admin/__generated__/RotateWebhookEndpointSecretMutation.graphql";

let clientMutationId = 0;

const RotateWebhookEndpointSecretMutation = createMutation(
  "rotateWebhookEndpointSecret",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RotateWebhookEndpointSecretMutation(
          $input: RotateWebhookEndpointSecretInput!
        ) {
          rotateWebhookEndpointSecret(input: $input) {
            endpoint {
              ...ConfigureWebhookEndpointContainer_webhookEndpoint
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

export default RotateWebhookEndpointSecretMutation;
