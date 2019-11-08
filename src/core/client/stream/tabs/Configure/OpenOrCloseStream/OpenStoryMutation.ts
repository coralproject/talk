import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";
import { OpenStoryEvent } from "coral-stream/events";

import { OpenStoryMutation as MutationTypes } from "coral-stream/__generated__/OpenStoryMutation.graphql";

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

async function commit(
  environment: Environment,
  input: OpenStoryInput,
  { eventEmitter }: CoralContext
) {
  const openStoryEvent = OpenStoryEvent.begin(eventEmitter, {
    storyID: input.id,
  });
  try {
    const result = await commitMutationPromiseNormalized<MutationTypes>(
      environment,
      {
        mutation,
        variables: {
          input: {
            id: input.id,
            clientMutationId: (clientMutationId++).toString(),
          },
        },
      }
    );
    openStoryEvent.success();
    return result;
  } catch (error) {
    openStoryEvent.error({ message: error.message, code: error.code });
    throw error;
  }
}

export const withOpenStoryMutation = createMutationContainer(
  "openStory",
  commit
);

export type OpenStoryMutation = (
  input: OpenStoryInput
) => MutationResponsePromise<MutationTypes, "openStory">;
