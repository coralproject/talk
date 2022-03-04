import { Localized } from "@fluent/react/compat";
import { FormApi } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql, useFragment } from "react-relay";

import { useMutation } from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
import {
  Button,
  Divider,
  Flex,
  HorizontalGutter,
  Textarea,
} from "coral-ui/components/v2";

import { UserDrawerNotesContainer_user$key as UserData } from "coral-admin/__generated__/UserDrawerNotesContainer_user.graphql";
import { UserDrawerNotesContainer_viewer$key as ViewerData } from "coral-admin/__generated__/UserDrawerNotesContainer_viewer.graphql";

import CreateModeratorNoteMutation from "./CreateModeratorNoteMutation";
import DeleteModeratorNoteMutation from "./DeleteModeratorNoteMutation";
import ModeratorNote from "./ModeratorNote";

import styles from "./UserDrawerNotesContainer.css";

interface Props {
  user: UserData;
  viewer: ViewerData | null;
}

const UserDrawerNotesContainer: FunctionComponent<Props> = ({
  user,
  viewer,
}) => {
  const userData = useFragment(
    graphql`
      fragment UserDrawerNotesContainer_user on User {
        id
        moderatorNotes {
          id
          body
          createdAt
          createdBy {
            username
            id
          }
        }
      }
    `,
    user
  );
  const viewerData = useFragment(
    graphql`
      fragment UserDrawerNotesContainer_viewer on User {
        id
      }
    `,
    viewer
  );

  const createNote = useMutation(CreateModeratorNoteMutation);
  const deleteNote = useMutation(DeleteModeratorNoteMutation);
  const onDelete = useCallback(
    (id: string) => {
      return deleteNote({
        id,
        userID: userData.id,
      });
    },
    [deleteNote, userData.id]
  );
  const onSubmit = useCallback(
    async ({ body }, form: FormApi) => {
      await createNote({
        userID: userData.id,
        body,
      });
      form.initialize({});
    },
    [createNote, userData.id]
  );
  return (
    <div>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitError, invalid, submitting, ...formProps }) => (
          <form
            className={styles.form}
            onSubmit={handleSubmit}
            data-testid="userdrawer-notes-form"
          >
            <Localized id="moderate-user-drawer-notes-field">
              <Field id="suspendModal-message" name="body" validate={required}>
                {({ input }) => (
                  <Textarea
                    placeholder="Leave a note..."
                    {...input}
                    className={styles.textArea}
                  />
                )}
              </Field>
            </Localized>
            <Flex justifyContent="flex-end">
              <Localized id="moderate-user-drawer-notes-button">
                <Button type="submit">Add note</Button>
              </Localized>
            </Flex>
          </form>
        )}
      </Form>
      <Divider />
      <HorizontalGutter spacing={4}>
        {userData.moderatorNotes &&
          userData.moderatorNotes
            .concat()
            .reverse()
            .map(
              (note) =>
                note && (
                  <ModeratorNote
                    key={note.id}
                    id={note.id}
                    body={note.body}
                    moderator={note.createdBy.username}
                    createdAt={note.createdAt}
                    onDelete={
                      viewerData && viewerData.id === note.createdBy.id
                        ? onDelete
                        : null
                    }
                  />
                )
            )}
      </HorizontalGutter>
    </div>
  );
};

export default UserDrawerNotesContainer;
