import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { CreateDSAReportMutation as MutationTypes } from "coral-stream/__generated__/CreateDSAReportMutation.graphql";

let clientMutationId = 0;

const CreateDSAReportMutation = createMutation(
  "createDSAReport",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const result = commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation CreateDSAReportMutation($input: CreateDSAReportInput!) {
          createDSAReport(input: $input) {
            dsaReport {
              id
              lawBrokenDescription
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          userID: input.userID,
          commentID: input.commentID,
          lawBrokenDescription: input.lawBrokenDescription,
          additionalInformation: input.additionalInformation,
          submissionID: input.submissionID,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
    return result;
  }
);

export default CreateDSAReportMutation;
