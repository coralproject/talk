import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DeleteAnnouncementMutation as MutationTypes } from "coral-admin/__generated__/DeleteAnnouncementMutation.graphql";

let clientMutationId = 0;

const DeleteAnnouncementMutation = createMutation(
  "deleteAnnouncement",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DeleteAnnouncementMutation($input: DeleteAnnouncementInput!) {
          deleteAnnouncement(input: $input) {
            clientMutationId
            settings {
              announcement {
                content
              }
            }
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

export default DeleteAnnouncementMutation;
