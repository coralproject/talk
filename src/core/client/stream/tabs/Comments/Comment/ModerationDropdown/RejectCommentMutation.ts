import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_STATUS } from "coral-framework/schema";

import { RejectCommentMutation as MutationTypes } from "coral-stream/__generated__/RejectCommentMutation.graphql";

let clientMutationId = 0;

const RejectCommentMutation = createMutation(
  "rejectComment",
  (
    environment: Environment,
    input: MutationInput<MutationTypes> & { storyID: string }
  ) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RejectCommentMutation($input: RejectCommentInput!) {
          rejectComment(input: $input) {
            comment {
              status
              tags {
                code
              }
              story {
                commentCounts {
                  tags {
                    FEATURED
                  }
                }
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          commentID: input.commentID,
          commentRevisionID: input.commentRevisionID,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
      optimisticResponse: {
        rejectComment: {
          comment: {
            id: input.commentID,
            status: GQLCOMMENT_STATUS.REJECTED,
            story: {
              commentCounts: {
                tags: {
                  FEATURED: 0,
                },
              },
            },
          },
          clientMutationId: clientMutationId.toString(),
        },
      },
      updater: store => {
        store.get(input.commentID)!.setValue("REJECT", "lastViewerAction");
      },
    })
);

export default RejectCommentMutation;
