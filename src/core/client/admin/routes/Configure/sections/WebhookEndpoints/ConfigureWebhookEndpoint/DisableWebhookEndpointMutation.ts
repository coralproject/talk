import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DisableWebhookEndpointMutation as MutationTypes } from "coral-admin/__generated__/DisableWebhookEndpointMutation.graphql";

let clientMutationId = 0;

const DisableWebhookEndpointMutation = createMutation(
  "disableWebhookEndpoint",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DisableWebhookEndpointMutation(
          $input: DisableWebhookEndpointInput!
        ) {
          disableWebhookEndpoint(input: $input) {
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

export default DisableWebhookEndpointMutation;
