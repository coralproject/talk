import { graphql } from "react-relay";
import { Environment, RecordSourceSelectorProxy } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { RequestDownloadCommentHistoryEvent } from "coral-stream/events";

import { RequestCommentsDownloadMutation as MutationTypes } from "coral-stream/__generated__/RequestCommentsDownloadMutation.graphql";

let clientMutationId = 0;

const RequestCommentsDownloadMutation = createMutation(
  "requestCommentsDownload",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }
  ) => {
    const updater = (store: RecordSourceSelectorProxy) => {
      const viewer = getViewer(environment)!;
      const user = store.get(viewer.id);
      const now = new Date();

      if (user) {
        user.setValue(now.toISOString(), "lastDownloadedAt");
      }
    };
    const requestDownloadCommentHistoryEvent =
      RequestDownloadCommentHistoryEvent.begin(eventEmitter);
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
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
        }
      );
      requestDownloadCommentHistoryEvent.success();
      return result;
    } catch (error) {
      requestDownloadCommentHistoryEvent.error({
        message: error.message,
        code: error.code,
      });
      throw error;
    }
  }
);

export default RequestCommentsDownloadMutation;
