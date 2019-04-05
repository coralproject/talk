import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CloseStoryMutation as MutationTypes } from "talk-admin/__generated__/CloseStoryMutation.graphql";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "talk-framework/lib/relay";
import { GQLSTORY_STATUS } from "talk-framework/schema";

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
