import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { ChangeReportStatusMutation as MutationTypes } from "coral-admin/__generated__/ChangeReportStatusMutation.graphql";

let clientMutationId = 0;

const ChangeReportStatusMutation = createMutation(
  "changeReportStatus",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const result = commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation ChangeReportStatusMutation(
          $input: ChangeDSAReportStatusInput!
        ) {
          changeDSAReportStatus(input: $input) {
            dsaReport {
              id
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          userID: input.userID,
          reportID: input.reportID,
          status: input.status,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
    return result;
  }
);

export default ChangeReportStatusMutation;
