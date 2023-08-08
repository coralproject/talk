import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DeleteFlairBadgeMutation as MutationTypes } from "coral-admin/__generated__/DeleteFlairBadgeMutation.graphql";

let clientMutationId = 0;

const DeleteFlairBadgeMutation = createMutation(
  "deleteFlairBadge",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DeleteFlairBadgeMutation($input: DeleteFlairBadgeInput!) {
          deleteFlairBadge(input: $input) {
            settings {
              flairBadges {
                flairBadgeURLs
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          flairBadgeURL: input.flairBadgeURL,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default DeleteFlairBadgeMutation;
