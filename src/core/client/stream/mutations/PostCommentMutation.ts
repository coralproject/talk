import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";
import {
  PostCommentMutationResponse,
  PostCommentMutationVariables,
} from "talk-stream/__generated__/PostCommentMutation.graphql";

export type PostCommentInput = Omit<
  PostCommentMutationVariables["input"],
  "clientMutationId"
>;

const mutation = graphql`
  mutation PostCommentMutation($input: PostCommentInput!) {
    postComment(input: $input) {
      comment {
        id
        author
        body
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment, input: PostCommentInput) {
  return commitMutationPromiseNormalized<
    PostCommentMutationResponse["postComment"],
    PostCommentMutationVariables
  >(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId: (clientMutationId++).toString(),
      },
    },
    updater: store => {
      const payload = store.getRootField("postComment");
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

export const withPostCommentMutation = createMutationContainer(
  "postComment",
  commit
);

export type PostCommentMutation = (
  input: PostCommentInput
) => Promise<PostCommentMutationResponse["postComment"]>;
