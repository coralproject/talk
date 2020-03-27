import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { TestSMTPMutation as MutationTypes } from "coral-admin/__generated__/TestSMTPMutation.graphql";

const clientMutationId = 0;

const TestSMTPMutation = createMutation(
  "testSMTP",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation TestSMTPMutation($input: TestSMTPInput!) {
          testSMTP(input: $input) {
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          clientMutationId: clientMutationId.toString(),
        },
      },
    });
  }
);

export default TestSMTPMutation;
