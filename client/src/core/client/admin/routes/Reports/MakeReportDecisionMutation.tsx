import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { MakeReportDecisionMutation as MutationTypes } from "coral-admin/__generated__/MakeReportDecisionMutation.graphql";

let clientMutationId = 0;

const MakeReportDecisionMutation = createMutation(
  "makeReportDecision",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const result = commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation MakeReportDecisionMutation(
          $input: MakeDSAReportDecisionInput!
        ) {
          makeDSAReportDecision(input: $input) {
            dsaReport {
              id
              status
              decision {
                legality
                legalGrounds
                detailedExplanation
              }
              history {
                id
                createdBy {
                  username
                }
                createdAt
                body
                type
                status
                decision {
                  legality
                  legalGrounds
                  detailedExplanation
                }
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
          // decision: input.decision,
          legality: input.legality,
          legalGrounds: input.legalGrounds,
          detailedExplanation: input.detailedExplanation,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
    return result;
  }
);

export default MakeReportDecisionMutation;
