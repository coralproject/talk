import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { getViewer } from "coral-framework/helpers";

import { RequestCommentsDownloadMutation as MutationTypes } from "coral-stream/__generated__/RequestCommentsDownloadMutation.graphql";

let clientMutationId = 0;

const RequestCommentsDownloadMutation = createMutation(
  "requestCommentsDownload",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RequestCommentsDownloadMutation(
          $input: RequestCommentsDownloadInput!
        ) {
          requestCommentsDownload(input: $input) {
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
      updater: store => {
        const viewer = getViewer(environment)!;
        alert(viewer.id);
      },
    })
);

export default RequestCommentsDownloadMutation;
