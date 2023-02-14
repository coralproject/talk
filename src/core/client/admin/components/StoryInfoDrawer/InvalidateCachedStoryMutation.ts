import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { InvalidateCachedStoryMutation as MutationTypes } from "coral-admin/__generated__/InvalidateCachedStoryMutation.graphql";

let clientMutationId = 0;

const InvalidateCachedStoryMutation = createMutation(
  "scrapeStory",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation InvalidateCachedStoryMutation(
          $input: InvalidateCachedStoryInput!
        ) {
          invalidateCachedStory(input: $input) {
            story {
              cached
              id
            }
            clientMutationId
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

export default InvalidateCachedStoryMutation;
