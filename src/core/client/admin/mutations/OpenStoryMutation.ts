import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "talk-framework/lib/relay";

import { OpenStoryMutation as MutationTypes } from "talk-admin/__generated__/OpenStoryMutation.graphql";
import { GQLSTORY_STATUS } from "talk-framework/schema";

export type OpenStoryInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation OpenStoryMutation($input: OpenStoryInput!) {
    openStory(input: $input) {
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

function commit(environment: Environment, input: OpenStoryInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    optimisticResponse: {
      openStory: {
        story: {
          id: input.id,
          status: GQLSTORY_STATUS.OPEN,
          closedAt: null,
          isClosed: false,
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

export const withOpenStoryMutation = createMutationContainer(
  "openStory",
  commit
);

export type OpenStoryMutation = (
  input: OpenStoryInput
) => MutationResponsePromise<MutationTypes, "openStory">;
