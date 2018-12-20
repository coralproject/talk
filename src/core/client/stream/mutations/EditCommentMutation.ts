import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";

import { EditCommentMutation as MutationTypes } from "talk-stream/__generated__/EditCommentMutation.graphql";

export type EditCommentInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
>;

const mutation = graphql`
  mutation EditCommentMutation($input: EditCommentInput!) {
    editComment(input: $input) {
      comment {
        body
        revision {
          id
        }
        editing {
          edited
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: EditCommentInput) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...pick(input, ["commentID", "body"]),
        clientMutationId: clientMutationId.toString(),
      },
    },
    optimisticResponse: {
      editComment: {
        id: input.commentID,
        body: input.body,
        editing: {
          edited: true,
        },
        clientMutationId: (clientMutationId++).toString(),
      },
    } as any, // TODO: (cvle) generated types should contain one for the optimistic response.
  });
}

export const withEditCommentMutation = createMutationContainer(
  "editComment",
  commit
);

export type EditCommentMutation = (
  input: EditCommentInput
) => Promise<MutationTypes["response"]["editComment"]>;
