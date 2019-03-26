import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "talk-framework/lib/relay";

import { CloseStoryMutation as MutationTypes } from "talk-admin/__generated__/CloseStoryMutation.graphql";
import { GQLSTORY_STATUS } from "talk-framework/schema";

export type CloseStoryInput = MutationInput<MutationTypes>;

const mutation = graphql`
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
`;

let clientMutationId = 0;

function commit(environment: Environment, input: CloseStoryInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
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
  });
}

export const withCloseStoryMutation = createMutationContainer(
  "closeStory",
  commit
);

export type CloseStoryMutation = (
  input: CloseStoryInput
) => MutationResponsePromise<MutationTypes, "closeStory">;
