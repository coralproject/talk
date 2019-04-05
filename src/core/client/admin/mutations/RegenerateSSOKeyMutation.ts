import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { RegenerateSSOKeyMutation as MutationTypes } from "talk-admin/__generated__/RegenerateSSOKeyMutation.graphql";
import {
  commitMutationPromiseNormalized,
  createMutation,
} from "talk-framework/lib/relay";

let clientMutationId = 0;

const RegenerateSSOKeyMutation = createMutation(
  "regenerateSSOKey",
  (environment: Environment) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RegenerateSSOKeyMutation($input: RegenerateSSOKeyInput!) {
          regenerateSSOKey(input: $input) {
            settings {
              auth {
                integrations {
                  sso {
                    key
                    keyGeneratedAt
                  }
                }
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default RegenerateSSOKeyMutation;
