import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLSTORY_STATUS } from "coral-framework/schema";

import { OpenStoryMutation as MutationTypes } from "coral-admin/__generated__/OpenStoryMutation.graphql";

let clientMutationId = 0;

const OpenStoryMutation = createMutation(
  "openStory",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation OpenStoryMutation($input: OpenStoryInput!) {
          openStory(input: $input) {
            story {
              id
              status
              closedAt
              isClosed
              isArchiving
              isArchived
            }
            clientMutationId
          }
        }
      `,
      optimisticResponse: {
        openStory: {
          story: {
            id: input.id,
            status: GQLSTORY_STATUS.OPEN,
            closedAt: null,
            isClosed: false,
            isArchived: false,
            isArchiving: false,
          },
          clientMutationId: clientMutationId.toString(),
        },
      },
      variables: {
        input: {
          ...input,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default OpenStoryMutation;
