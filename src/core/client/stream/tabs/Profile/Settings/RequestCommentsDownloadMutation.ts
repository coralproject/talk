import { graphql } from "react-relay";
import { Environment, RecordSourceSelectorProxy } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RequestCommentsDownloadMutation as MutationTypes } from "coral-stream/__generated__/RequestCommentsDownloadMutation.graphql";

let clientMutationId = 0;

const RequestCommentsDownloadMutation = createMutation(
  "requestCommentsDownload",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const updater = (store: RecordSourceSelectorProxy) => {
      const viewer = getViewer(environment)!;
      const user = store.get(viewer.id);
      const now = new Date();

      if (user !== null) {
        user.setValue(now.toISOString(), "lastDownloadedAt");
      }
    };

    return commitMutationPromiseNormalized<MutationTypes>(environment, {
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
      optimisticUpdater: updater,
      updater,
    });
  }
);

export default RequestCommentsDownloadMutation;
