import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";
import { ReportCommentEvent } from "coral-stream/events";

import { CreateCommentFlagMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentFlagMutation.graphql";

export type CreateCommentFlagInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation CreateCommentFlagMutation($input: CreateCommentFlagInput!) {
    createCommentFlag(input: $input) {
      comment {
        id
        viewerActionPresence {
          flag
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

async function commit(
  environment: Environment,
  input: CreateCommentFlagInput,
  { eventEmitter }: CoralContext
) {
  const reportCommentEvent = ReportCommentEvent.begin(eventEmitter, {
    reason: input.reason,
    commentID: input.commentID,
  });
  try {
    const result = await commitMutationPromiseNormalized<MutationTypes>(
      environment,
      {
        mutation,
        variables: {
          input: {
            ...pick(input, [
              "commentID",
              "commentRevisionID",
              "reason",
              "additionalDetails",
            ]),
            clientMutationId: (clientMutationId++).toString(),
          },
        },
      }
    );
    reportCommentEvent.success();
    return result;
  } catch (error) {
    reportCommentEvent.error({ message: error.message, code: error.code });
    throw error;
  }
}

export const withCreateCommentFlagMutation = createMutationContainer(
  "createCommentFlag",
  commit
);

export type CreateCommentFlagMutation = (
  input: CreateCommentFlagInput
) => MutationResponsePromise<MutationTypes, "createCommentFlag">;
