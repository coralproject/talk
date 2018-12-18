import { graphql } from "react-relay";
import { ConnectionHandler, Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";

import { RejectCommentMutation as MutationTypes } from "talk-admin/__generated__/RejectCommentMutation.graphql";
import { getQueueConnection } from "talk-admin/helpers";

export type RejectCommentInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
>;

const mutation = graphql`
  mutation RejectCommentMutation($input: RejectCommentInput!) {
    rejectComment(input: $input) {
      comment {
        id
        status
      }
      moderationQueues {
        unmoderated {
          count
        }
        reported {
          count
        }
        pending {
          count
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: RejectCommentInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId: clientMutationId.toString(),
      },
    },
    optimisticResponse: {
      rejectComment: {
        comment: {
          id: input.commentID,
          status: "REJECTED",
        },
        clientMutationId: (clientMutationId++).toString(),
      },
    } as any, // TODO: (cvle) generated types should contain one for the optimistic response.
    updater: store => {
      const connections = [
        getQueueConnection("reported", store),
        getQueueConnection("pending", store),
        getQueueConnection("unmoderated", store),
      ].filter(c => c);
      connections.forEach(con =>
        ConnectionHandler.deleteNode(con, input.commentID)
      );
    },
  });
}

export const withRejectCommentMutation = createMutationContainer(
  "rejectComment",
  commit
);

export type RejectCommentMutation = (
  input: RejectCommentInput
) => Promise<MutationTypes["response"]["rejectComment"]>;
