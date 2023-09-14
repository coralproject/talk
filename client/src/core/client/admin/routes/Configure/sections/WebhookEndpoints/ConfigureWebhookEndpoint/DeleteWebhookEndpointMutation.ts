import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DeleteWebhookEndpointMutation as MutationTypes } from "coral-admin/__generated__/DeleteWebhookEndpointMutation.graphql";

let clientMutationId = 0;

const DeleteWebhookEndpointMutation = createMutation(
  "deleteWebhookEndpoint",
  (environment: Environment, { id }: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DeleteWebhookEndpointMutation(
          $input: DeleteWebhookEndpointInput!
        ) {
          deleteWebhookEndpoint(input: $input) {
            endpoint {
              id
            }
          }
        }
      `,
      variables: {
        input: {
          id,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default DeleteWebhookEndpointMutation;
