import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { BanCommentUserMutation as MutationTypes } from "coral-admin/__generated__/BanCommentUserMutation.graphql";

const clientMutationId = 0;

const BanCommentUserMutation = createMutation(
  "banUser",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation BanCommentUserMutation($input: BanUserInput!) {
          banUser(input: $input) {
            user {
              id
              status {
                current
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          ...input,
          clientMutationId: clientMutationId.toString(),
        },
      },
      updater: (store) => {
        const user = store.get(input.userID);
        if (user) {
          const comments = user.getLinkedRecords("comments");
          if (comments) {
            comments.forEach((comment) => {
              if (comment) {
                comment.setLinkedRecord(user, "author");
              }
            });
          }
        }
      },
    });
  }
);

export default BanCommentUserMutation;
