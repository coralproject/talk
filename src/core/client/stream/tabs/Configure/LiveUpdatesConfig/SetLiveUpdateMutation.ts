import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { SetLiveUpdateMutation } from "coral-stream/__generated__/SetLiveUpdateMutation.graphql";

let clientMutationId = 0;

const SetLiveUpdateMutation = createMutation(
  "disableQA",
  (
    environment: Environment,
    input: MutationInput<SetLiveUpdateMutation> & {
      id: string;
      settings: any;
    }
  ) =>
    commitMutationPromiseNormalized<SetLiveUpdateMutation>(environment, {
      mutation: graphql`
        mutation SetLiveUpdateMutation($input: UpdateStorySettingsInput!) {
          updateStorySettings(input: $input) {
            story {
              id
              settings {
                live {
                  enabled
                  configurable
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

export default SetLiveUpdateMutation;
