import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { CreateWebhookEndpointMutation as MutationTypes } from "coral-admin/__generated__/CreateWebhookEndpointMutation.graphql";

let clientMutationId = 0;

const CreateWebhookEndpointMutation = createMutation(
  "createWebhookEndpoint",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation CreateWebhookEndpointMutation(
          $input: CreateWebhookEndpointInput!
        ) {
          createWebhookEndpoint(input: $input) {
            endpoint {
              id
            }
            settings {
              ...WebhookEndpointsConfigContainer_settings
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

export default CreateWebhookEndpointMutation;
