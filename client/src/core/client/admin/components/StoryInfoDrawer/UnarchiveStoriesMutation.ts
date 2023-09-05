import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLSTORY_STATUS } from "coral-framework/schema";

import { UnarchiveStoriesMutation as MutationTypes } from "coral-admin/__generated__/UnarchiveStoriesMutation.graphql";

let clientMutationId = 0;

const UnarchiveStoriesMutation = createMutation(
  "unarchiveStories",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UnarchiveStoriesMutation($input: UnarchiveStoriesInput!) {
          unarchiveStories(input: $input) {
            stories {
              id
              status
              isArchived
              isArchiving
              isUnarchiving
            }
            clientMutationId
          }
        }
      `,
      optimisticResponse: {
        unarchiveStories: {
          stories: [
            {
              id: input.storyIDs[0],
              status: GQLSTORY_STATUS.CLOSED,
              isArchived: true,
              isArchiving: false,
              isUnarchiving: true,
            },
          ],
          clientMutationId: clientMutationId.toString(),
        },
      },
      variables: {
        input: {
          storyIDs: input.storyIDs,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default UnarchiveStoriesMutation;
