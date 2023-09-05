import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateStoryModeMutation } from "coral-stream/__generated__/UpdateStoryModeMutation.graphql";

let clientMutationId = 0;

const UpdateStoryModeMutation = createMutation(
  "disableQA",
  (
    environment: Environment,
    input: MutationInput<UpdateStoryModeMutation> & {
      storyID: string;
      mode: string;
    }
  ) =>
    commitMutationPromiseNormalized<UpdateStoryModeMutation>(environment, {
      mutation: graphql`
        mutation UpdateStoryModeMutation($input: UpdateStoryModeInput!) {
          updateStoryMode(input: $input) {
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
          mode: input.mode,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default UpdateStoryModeMutation;
