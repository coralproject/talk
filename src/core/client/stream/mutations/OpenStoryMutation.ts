import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "talk-framework/lib/relay";

import { OpenStoryMutation as MutationTypes } from "talk-stream/__generated__/OpenStoryMutation.graphql";

export type OpenStoryInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation OpenStoryMutation($input: OpenStoryInput!) {
    openStory(input: $input) {
      story {
        ...ConfigureContainer_story
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: OpenStoryInput) {
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

export const withOpenStoryMutation = createMutationContainer(
  "openStory",
  commit
);

export type OpenStoryMutation = (
  input: OpenStoryInput
) => MutationResponsePromise<MutationTypes, "openStory">;
