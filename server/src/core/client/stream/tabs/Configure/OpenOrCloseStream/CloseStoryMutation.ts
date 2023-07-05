import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";
import { CloseStoryEvent } from "coral-stream/events";

import { CloseStoryMutation as MutationTypes } from "coral-stream/__generated__/CloseStoryMutation.graphql";

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

async function commit(
  environment: Environment,
  input: CloseStoryInput,
  { eventEmitter }: CoralContext
) {
  const closeStoryEvent = CloseStoryEvent.begin(eventEmitter, {
    storyID: input.id,
  });
  try {
    const result = await commitMutationPromiseNormalized<MutationTypes>(
      environment,
      {
        mutation,
        variables: {
          input: {
            ...input,
            clientMutationId: (clientMutationId++).toString(),
          },
        },
      }
    );
    closeStoryEvent.success();
    return result;
  } catch (error) {
    closeStoryEvent.error({ message: error.message, code: error.code });
    throw error;
  }
}

export const withCloseStoryMutation = createMutationContainer(
  "closeStory",
  commit
);

export type CloseStoryMutation = (
  input: CloseStoryInput
) => MutationResponsePromise<MutationTypes, "closeStory">;
