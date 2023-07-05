import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { AddExpertMutation } from "coral-stream/__generated__/AddExpertMutation.graphql";

let clientMutationId = 0;

const AddExpertMutation = createMutation(
  "addExpert",
  (environment: Environment, input: MutationInput<AddExpertMutation>) =>
    commitMutationPromiseNormalized<AddExpertMutation>(environment, {
      mutation: graphql`
        mutation AddExpertMutation($input: AddStoryExpertInput!) {
          addStoryExpert(input: $input) {
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

export default AddExpertMutation;
