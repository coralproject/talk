import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { EnableWebhookEndpointMutation as MutationTypes } from "coral-admin/__generated__/EnableWebhookEndpointMutation.graphql";

let clientMutationId = 0;

const EnableWebhookEndpointMutation = createMutation(
  "enableWebhookEndpoint",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation EnableWebhookEndpointMutation(
          $input: EnableWebhookEndpointInput!
        ) {
          enableWebhookEndpoint(input: $input) {
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

export default EnableWebhookEndpointMutation;
