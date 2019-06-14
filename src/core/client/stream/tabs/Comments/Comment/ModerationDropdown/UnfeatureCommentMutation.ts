import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLTAG } from "coral-framework/schema";
import { UnfeatureCommentMutation as MutationTypes } from "coral-stream/__generated__/UnfeatureCommentMutation.graphql";

let clientMutationId = 0;

const UnfeatureCommentMutation = createMutation(
  "unfeatureComment",
  (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { uuidGenerator }: CoralContext
  ) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
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
      optimisticUpdater: store => {
        const comment = store.get(input.commentID)!;
        const tags = comment.getLinkedRecords("tags")!;
        comment.setLinkedRecords(
          tags.filter(t => t!.getValue("code") === GQLTAG.FEATURED),
          "tags"
        );
      },
      variables: {
        input: {
          ...input,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default UnfeatureCommentMutation;
