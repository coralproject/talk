import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { CreateFlairBadgeMutation as MutationTypes } from "coral-admin/__generated__/CreateFlairBadgeMutation.graphql";

let clientMutationId = 0;

const CreateFlairBadgeMutation = createMutation(
  "createFlairBadge",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation CreateFlairBadgeMutation($input: CreateFlairBadgeInput!) {
          createFlairBadge(input: $input) {
            settings {
              flairBadges {
                flairBadgesEnabled
                badges {
                  name
                  url
                }
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          name: input.name,
          url: input.url,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default CreateFlairBadgeMutation;
