import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateMessageBoxMutation } from "coral-stream/__generated__/UpdateMessageBoxMutation.graphql";

let clientMutationId = 0;

const UpdateMessageBoxMutation = createMutation(
  "disableQA",
  (
    environment: Environment,
    input: MutationInput<UpdateMessageBoxMutation> & {
      id: string;
      settings: any;
    }
  ) =>
    commitMutationPromiseNormalized<UpdateMessageBoxMutation>(environment, {
      mutation: graphql`
        mutation UpdateMessageBoxMutation($input: UpdateStorySettingsInput!) {
          updateStorySettings(input: $input) {
            story {
              id
              settings {
                messageBox {
                  enabled
                  content
                  icon
                }
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          id: input.id,
          settings: input.settings,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default UpdateMessageBoxMutation;
