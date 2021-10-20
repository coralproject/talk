import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLSTORY_STATUS } from "coral-framework/schema";

import { CloseStoryMutation as MutationTypes } from "coral-admin/__generated__/CloseStoryMutation.graphql";

let clientMutationId = 0;

const CloseStoryMutation = createMutation(
  "closeStory",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation CloseStoryMutation($input: CloseStoryInput!) {
          closeStory(input: $input) {
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
        closeStory: {
          story: {
            id: input.id,
            status: GQLSTORY_STATUS.CLOSED,
            closedAt: new Date().toISOString(),
            isClosed: true,
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

export default CloseStoryMutation;
