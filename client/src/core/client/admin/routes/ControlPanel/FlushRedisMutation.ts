import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { FlushRedisMutation as MutationTypes } from "coral-admin/__generated__/FlushRedisMutation.graphql";

let clientMutationId = 0;

const FlushRedisMutation = createMutation(
  "flushRedis",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation FlushRedisMutation($input: FlushRedisInput!) {
          flushRedis(input: $input) {
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          ...input,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default FlushRedisMutation;
