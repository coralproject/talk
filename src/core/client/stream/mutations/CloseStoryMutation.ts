import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "talk-framework/lib/relay";

import { CloseStoryMutation as MutationTypes } from "talk-stream/__generated__/CloseStoryMutation.graphql";

export type CloseStoryInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation CloseStoryMutation($input: CloseStoryInput!) {
    closeStory(input: $input) {
      story {
        ...ConfigureContainer_story
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: CloseStoryInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
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
