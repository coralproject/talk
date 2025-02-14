import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RemoveExpertMutation } from "coral-stream/__generated__/RemoveExpertMutation.graphql";

let clientMutationId = 0;

const RemoveExpertMutation = createMutation(
  "removeExpert",
  (environment: Environment, input: MutationInput<RemoveExpertMutation>) =>
    commitMutationPromiseNormalized<RemoveExpertMutation>(environment, {
      mutation: graphql`
        mutation RemoveExpertMutation($input: RemoveStoryExpertInput!) {
          removeStoryExpert(input: $input) {
            story {
              id
              settings {
                experts {
                  id
                  username
                  email
                }
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          storyID: input.storyID,
          userID: input.userID,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default RemoveExpertMutation;
