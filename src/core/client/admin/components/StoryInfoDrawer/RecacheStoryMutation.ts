import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RecacheStoryMutation as MutationTypes } from "coral-admin/__generated__/RecacheStoryMutation.graphql";

let clientMutationId = 0;

const RecacheStoryMutation = createMutation(
  "scrapeStory",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RecacheStoryMutation($input: CacheStoryInput!) {
          cacheStory(input: $input) {
            story {
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

export default RecacheStoryMutation;
