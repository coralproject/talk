import { graphql } from "react-relay";
import { ConnectionHandler, Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";

import { AcceptCommentMutation as MutationTypes } from "talk-admin/__generated__/AcceptCommentMutation.graphql";
import { getQueueConnection } from "talk-admin/helpers";

export type AcceptCommentInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
>;

const mutation = graphql`
  mutation AcceptCommentMutation($input: AcceptCommentInput!) {
    acceptComment(input: $input) {
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

function commit(environment: Environment, input: AcceptCommentInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId: clientMutationId.toString(),
      },
    },
    optimisticResponse: {
      acceptComment: {
        comment: {
          id: input.commentID,
          status: "ACCEPTED",
        },
        clientMutationId: (clientMutationId++).toString(),
      },
    } as any, // TODO: (cvle) generated types should contain one for the optimistic response.
    updater: store => {
      const connections = [
        getQueueConnection("reported", store),
        getQueueConnection("pending", store),
        getQueueConnection("unmoderated", store),
        getQueueConnection("rejected", store),
      ].filter(c => c);
      connections.forEach(con =>
        ConnectionHandler.deleteNode(con, input.commentID)
      );
    },
  });
}

export const withAcceptCommentMutation = createMutationContainer(
  "acceptComment",
  commit
);

export type AcceptCommentMutation = (
  input: AcceptCommentInput
) => Promise<MutationTypes["response"]["acceptComment"]>;
