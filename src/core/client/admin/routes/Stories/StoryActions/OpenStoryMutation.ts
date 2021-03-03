import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { GQLSTORY_STATUS } from "coral-admin/schema";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

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
