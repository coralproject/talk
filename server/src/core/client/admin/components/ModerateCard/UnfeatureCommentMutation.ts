import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLTAG } from "coral-framework/schema";

import { UnfeatureCommentMutation } from "coral-stream/__generated__/UnfeatureCommentMutation.graphql";

let clientMutationId = 0;

const UnfeatureCommentMutation = createMutation(
  "unfeatureComment",
  (
    environment: Environment,
    input: MutationInput<UnfeatureCommentMutation> & { storyID: string }
  ) =>
    commitMutationPromiseNormalized<UnfeatureCommentMutation>(environment, {
      mutation: graphql`
        mutation UnfeatureCommentMutation($input: UnfeatureCommentInput!) {
          unfeatureComment(input: $input) {
            comment {
              tags {
                code
              }
            }
            clientMutationId
          }
        }
      `,
      optimisticUpdater: (store) => {
        const comment = store.get(input.commentID)!;
        const tags = comment.getLinkedRecords("tags")!;
        comment.setLinkedRecords(
          tags.filter((t) => t.getValue("code") === GQLTAG.FEATURED),
          "tags"
        );
      },
      variables: {
        input: {
          commentID: input.commentID,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default UnfeatureCommentMutation;
