import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateSiteMutation as MutationTypes } from "coral-admin/__generated__/UpdateSiteMutation.graphql";

const clientMutationId = 0;

const UpdateSiteMutation = createMutation(
  "updateSite",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UpdateSiteMutation($input: UpdateSiteInput!) {
          updateSite(input: $input) {
            site {
              id
              name
              createdAt
              allowedOrigins
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          ...input,
          clientMutationId: clientMutationId.toString(),
        },
      },
    });
  }
);

export default UpdateSiteMutation;
