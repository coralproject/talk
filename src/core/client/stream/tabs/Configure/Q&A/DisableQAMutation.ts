import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DisableQAMutation } from "coral-stream/__generated__/DisableQAMutation.graphql";

let clientMutationId = 0;

const DisableQAMutation = createMutation(
  "disableQA",
  (
    environment: Environment,
    input: MutationInput<DisableQAMutation> & {
      storyID: string;
    }
  ) =>
    commitMutationPromiseNormalized<DisableQAMutation>(environment, {
      mutation: graphql`
        mutation DisableQAMutation($input: DisableQAInput!) {
          disableQAOnStory(input: $input) {
            story {
              id
              settings {
                mode
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          storyID: input.storyID,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default DisableQAMutation;
