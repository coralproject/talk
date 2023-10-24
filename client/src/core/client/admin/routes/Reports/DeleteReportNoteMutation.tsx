import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DeleteReportNoteMutation as MutationTypes } from "coral-admin/__generated__/DeleteReportNoteMutation.graphql";

let clientMutationId = 0;

const DeleteReportNoteMutation = createMutation(
  "deleteReportNote",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const result = commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DeleteReportNoteMutation($input: DeleteDSAReportNoteInput!) {
          deleteDSAReportNote(input: $input) {
            dsaReport {
              id
              history {
                id
                createdBy {
                  username
                }
                createdAt
                body
                type
                status
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          id: input.id,
          reportID: input.reportID,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
    return result;
  }
);

export default DeleteReportNoteMutation;
