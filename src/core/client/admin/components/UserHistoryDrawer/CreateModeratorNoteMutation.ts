import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLUser } from "coral-framework/schema";

import { CreateModeratorNoteMutation as MutationTypes } from "coral-admin/__generated__/CreateModeratorNoteMutation.graphql";

let clientMutationId = 0;

const CreateModeratorNoteMutation = createMutation(
  "createModeratorNote",
  (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { uuidGenerator }: CoralContext
  ) => {
    const viewer = getViewer(environment)!;
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
    const now = new Date();
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation CreateModeratorNoteMutation(
          $input: CreateModeratorNoteInput!
        ) {
          createModeratorNote(input: $input) {
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
        createModeratorNote: {
          user: {
            id: input.userID,
            moderatorNotes: [
              {
                id: uuidGenerator(),
                body: input.body,
                createdAt: now.toISOString(),
                createdBy: {
                  username: viewer.username || null,
                  id: viewer.id,
                } as any,
              },
              ...notes,
            ],
          },
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
  }
);

export default CreateModeratorNoteMutation;
