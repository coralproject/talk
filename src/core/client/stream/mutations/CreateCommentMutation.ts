import { graphql } from "react-relay";
import { Environment } from "relay-runtime";
import uuid from "uuid/v4";

import { getMe } from "talk-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";

import { CreateCommentMutation as MutationTypes } from "talk-stream/__generated__/CreateCommentMutation.graphql";

export type CreateCommentInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
>;

const mutation = graphql`
  mutation CreateCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      edge {
        cursor
        node {
          id
          author {
            id
            username
          }
          body
          createdAt
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: CreateCommentInput) {
  const me = getMe(environment)!;
  const currentDate = new Date().toISOString();
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId: clientMutationId.toString(),
      },
    },
    optimisticResponse: {
      createComment: {
        edge: {
          cursor: currentDate,
          node: {
            id: uuid(),
            createdAt: currentDate,
            author: {
              id: me.id,
              username: me.username,
            },
            body: input.body,
          },
        },
        clientMutationId: (clientMutationId++).toString(),
      },
    },
    configs: [
      {
        type: "RANGE_ADD",
        connectionInfo: [
          {
            key: "Stream_comments",
            rangeBehavior: "prepend",
            filters: { orderBy: "CREATED_AT_DESC" },
          },
        ],
        parentID: input.assetID,
        edgeName: "edge",
      },
    ],
  });
}

export const withCreateCommentMutation = createMutationContainer(
  "createComment",
  commit
);

export type CreateCommentMutation = (
  input: CreateCommentInput
) => Promise<MutationTypes["response"]["createComment"]>;
