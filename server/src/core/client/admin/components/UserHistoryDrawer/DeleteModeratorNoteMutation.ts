import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLUser } from "coral-framework/schema";

import { DeleteModeratorNoteMutation as MutationTypes } from "coral-admin/__generated__/DeleteModeratorNoteMutation.graphql";

let clientMutationId = 0;

const DeleteModeratorNoteMutation = createMutation(
  "deleteModeratorNote",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const notes =
      lookup<GQLUser>(environment, input.userID)!.moderatorNotes.map((note) => {
        return {
          ...pick(note, ["id", "body", "createdAt"]),
          createdBy: {
            id: note.createdBy.id,
            username: note.createdBy.username || null,
          },
        };
      }) || [];
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DeleteModeratorNoteMutation(
          $input: DeleteModeratorNoteInput!
        ) {
          deleteModeratorNote(input: $input) {
            user {
              id
              moderatorNotes {
                id
                body
                createdBy {
                  username
                  id
                }
                createdAt
              }
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
      optimisticResponse: {
        deleteModeratorNote: {
          user: {
            id: input.userID,
            moderatorNotes: notes.filter((note) => note.id !== input.id),
          },
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
  }
);

export default DeleteModeratorNoteMutation;
