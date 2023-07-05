import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RescrapeStoryMutation as MutationTypes } from "coral-admin/__generated__/RescrapeStoryMutation.graphql";

let clientMutationId = 0;

const RescrapeStoryMutation = createMutation(
  "scrapeStory",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RescrapeStoryMutation($input: ScrapeStoryInput!) {
          scrapeStory(input: $input) {
            story {
              id
              metadata {
                title
              }
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

export default RescrapeStoryMutation;
