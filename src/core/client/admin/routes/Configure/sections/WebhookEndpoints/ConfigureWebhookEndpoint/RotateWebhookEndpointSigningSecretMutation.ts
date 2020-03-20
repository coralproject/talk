import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RotateWebhookEndpointSigningSecretMutation as MutationTypes } from "coral-admin/__generated__/RotateWebhookEndpointSigningSecretMutation.graphql";

let clientMutationId = 0;

const RotateWebhookEndpointSigningSecretMutation = createMutation(
  "rotateWebhookEndpointSigningSecret",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RotateWebhookEndpointSigningSecretMutation(
          $input: RotateWebhookEndpointSigningSecretInput!
        ) {
          rotateWebhookEndpointSigningSecret(input: $input) {
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

export default RotateWebhookEndpointSigningSecretMutation;
