import { graphql } from "react-relay";
import { Environment } from "relay-runtime";
import uuid from "uuid/v4";

import { getMe } from "talk-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";

import {
  CreateCommentMutationResponse,
  CreateCommentMutationVariables,
} from "talk-stream/__generated__/CreateCommentMutation.graphql";

export type CreateCommentInput = Omit<
  CreateCommentMutationVariables["input"],
  "clientMutationId"
>;

const mutation = graphql`
  mutation CreateCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      commentEdge {
        cursor
        node {
          id
          ...CommentContainer
          ...ReplyListContainer_comment
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
  return commitMutationPromiseNormalized<
    CreateCommentMutationResponse["createComment"],
    CreateCommentMutationVariables
  >(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId: clientMutationId.toString(),
      },
    },
    optimisticResponse: {
      createComment: {
        commentEdge: {
          cursor: currentDate,
          node: {
            id: uuid(),
            createdAt: currentDate,
            author: {
              id: me.id,
              username: me.username,
            },
            body: input.body,
            replies: {
              edges: [],
              pageInfo: {
                endCursor: null,
                hasNextPage: false,
              },
            },
            __typename: "Comment",
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
        edgeName: "commentEdge",
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
) => Promise<CreateCommentMutationResponse["createComment"]>;
