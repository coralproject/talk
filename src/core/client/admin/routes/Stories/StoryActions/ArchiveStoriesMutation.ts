import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLSTORY_STATUS } from "coral-framework/schema";

import { ArchiveStoriesMutation as MutationTypes } from "coral-admin/__generated__/ArchiveStoriesMutation.graphql";

let clientMutationId = 0;

const ArchiveStoriesMutation = createMutation(
  "archiveStories",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation ArchiveStoriesMutation($input: ArchiveStoriesInput!) {
          archiveStories(input: $input) {
            stories {
              id
              status
              isArchived
              isArchiving
            }
            clientMutationId
          }
        }
      `,
      optimisticResponse: {
        archiveStories: {
          stories: [
            {
              id: input.storyIDs[0],
              status: GQLSTORY_STATUS.CLOSED,
              isArchived: true,
              isArchiving: false,
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

export default ArchiveStoriesMutation;
