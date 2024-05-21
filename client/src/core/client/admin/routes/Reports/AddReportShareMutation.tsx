import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { AddReportShareMutation as MutationTypes } from "coral-admin/__generated__/AddReportShareMutation.graphql";

let clientMutationId = 0;

const AddReportShareMutation = createMutation(
  "addReportShare",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const result = commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation AddReportShareMutation($input: AddDSAReportShareInput!) {
          addDSAReportShare(input: $input) {
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
          userID: input.userID,
          reportID: input.reportID,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
    return result;
  }
);

export default AddReportShareMutation;
