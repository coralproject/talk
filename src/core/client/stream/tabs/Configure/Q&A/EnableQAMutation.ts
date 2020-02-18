import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { EnableQAMutation } from "coral-stream/__generated__/EnableQAMutation.graphql";

let clientMutationId = 0;

const EnableQAMutation = createMutation(
  "enableQA",
  (
    environment: Environment,
    input: MutationInput<EnableQAMutation> & {
      storyID: string;
    }
  ) =>
    commitMutationPromiseNormalized<EnableQAMutation>(environment, {
      mutation: graphql`
        mutation EnableQAMutation($input: EnableQAInput!) {
          enableQAOnStory(input: $input) {
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

export default EnableQAMutation;
