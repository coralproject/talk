import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

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
      comment {
        id
        author {
          username
        }
        body
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: CreateCommentInput) {
  return commitMutationPromiseNormalized<
    CreateCommentMutationResponse["createComment"],
    CreateCommentMutationVariables
  >(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId: (clientMutationId++).toString(),
      },
    },
    updater: store => {
      const payload = store.getRootField("createComment");
      if (payload) {
        const newRecord = payload.getLinkedRecord("comment")!;
        const root = store.getRoot();
        const records = root.getLinkedRecords("comments");
        if (!records) {
          throw new Error("Unexpected cache state");
        }

        root.setLinkedRecords([...records, newRecord], "comments");
      }
    },
  });
}

export const withCreateCommentMutation = createMutationContainer(
  "createComment",
  commit
);

export type CreateCommentMutation = (
  input: CreateCommentInput
) => Promise<CreateCommentMutationResponse["createComment"]>;
