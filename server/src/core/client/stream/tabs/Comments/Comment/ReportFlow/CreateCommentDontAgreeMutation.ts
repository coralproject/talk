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

import { CreateCommentDontAgreeMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentDontAgreeMutation.graphql";

export type CreateCommentDontAgreeInput = MutationInput<MutationTypes>;

const mutation = graphql`
  mutation CreateCommentDontAgreeMutation(
    $input: CreateCommentDontAgreeInput!
  ) {
    createCommentDontAgree(input: $input) {
      comment {
        id
        viewerActionPresence {
          dontAgree
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

async function commit(
  environment: Environment,
  input: CreateCommentDontAgreeInput,
  { eventEmitter }: CoralContext
) {
  const reportCommentEvent = ReportCommentEvent.begin(eventEmitter, {
    reason: "DONT_AGREE",
    additionalDetails: input.additionalDetails || undefined,
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

export const withCreateCommentDontAgreeMutation = createMutationContainer(
  "createCommentDontAgree",
  commit
);

export type CreateCommentDontAgreeMutation = (
  input: CreateCommentDontAgreeInput
) => MutationResponsePromise<MutationTypes, "createCommentDontAgree">;
