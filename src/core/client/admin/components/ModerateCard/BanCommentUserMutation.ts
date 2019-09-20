import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { BanCommentUserMutation as MutationTypes } from "coral-admin/__generated__/BanCommentUserMutation.graphql";
import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

const clientMutationId = 0;

const BanCommentUserMutation = createMutation(
  "banUser",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const viewer = getViewer(environment)!;
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
      updater: store => {
        const user = store.get(input.userID);
        if (user) {
          const comments = user.getLinkedRecords("comments");
          if (comments) {
            comments.forEach(comment => {
              comment.setLinkedRecord(user, "author");
            });
          }
        }
      },
      // optimisticResponse: {
      //   banUser: {
      //     user: {
      //       id: input.userID,
      //       status: {
      //         current: lookup<GQLUser>(
      //           environment,
      //           input.userID
      //         )!.status.current.concat(GQLUSER_STATUS.BANNED),
      //       },
      //     },
      //     clientMutationId: (clientMutationId++).toString(),
      //   },
      // },
    });
  }
);

export default BanCommentUserMutation;
