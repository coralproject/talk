import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { AddReportNoteMutation as MutationTypes } from "coral-admin/__generated__/AddReportNoteMutation.graphql";

let clientMutationId = 0;

const AddReportNoteMutation = createMutation(
  "createDSAReport",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const result = commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation AddReportNoteMutation($input: AddDSAReportNoteInput!) {
          addDSAReportNote(input: $input) {
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
          body: input.body,
          reportID: input.reportID,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
    return result;
  }
);

export default AddReportNoteMutation;
