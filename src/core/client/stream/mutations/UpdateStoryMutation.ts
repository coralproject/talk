import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "talk-framework/lib/relay";

import { UpdateStoryMutation as MutationTypes } from "talk-stream/__generated__/UpdateStoryMutation.graphql";

export type UpdateStoryInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation UpdateStoryMutation($input: UpdateStoryInput!) {
    updateStory(input: $input) {
      story {
        ...ConfigureContainer_story
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: UpdateStoryInput) {
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

export const withUpdateStoryMutation = createMutationContainer(
  "updateStory",
  commit
);

export type UpdateStoryMutation = (
  input: UpdateStoryInput
) => MutationResponsePromise<MutationTypes, "updateStory">;
