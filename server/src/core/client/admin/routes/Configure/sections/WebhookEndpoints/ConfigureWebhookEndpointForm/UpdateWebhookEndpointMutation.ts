import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateWebhookEndpointMutation as MutationTypes } from "coral-admin/__generated__/UpdateWebhookEndpointMutation.graphql";

let clientMutationId = 0;

const UpdateWebhookEndpointMutation = createMutation(
  "updateWebhookEndpoint",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UpdateWebhookEndpointMutation(
          $input: UpdateWebhookEndpointInput!
        ) {
          updateWebhookEndpoint(input: $input) {
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

export default UpdateWebhookEndpointMutation;
