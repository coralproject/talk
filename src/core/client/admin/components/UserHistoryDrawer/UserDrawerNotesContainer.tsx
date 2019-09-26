import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { UserDrawerNotesContainer_user as UserData } from "coral-admin/__generated__/UserDrawerNotesContainer_user.graphql";
import { UserDrawerNotesContainer_viewer as ViewerData } from "coral-admin/__generated__/UserDrawerNotesContainer_viewer.graphql";
import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
import { Button, Flex, HorizontalGutter } from "coral-ui/components";
import { FormApi } from "final-form";
import { Field, Form } from "react-final-form";
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
  const createNote = useMutation(CreateModeratorNoteMutation);
  const deleteNote = useMutation(DeleteModeratorNoteMutation);
  const onDelete = useCallback(
    (id: string) => {
      return deleteNote({
        id,
        userID: user.id,
      });
    },
    [user]
  );
  const onSubmit = useCallback(
    async ({ body }, form: FormApi) => {
      await createNote({
        userID: user.id,
        body,
      });
      form.reset();
    },
    [createNote, user]
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
              <Field
                className={styles.textArea}
                id="suspendModal-message"
                component="textarea"
                name="body"
                validate={required}
                placeholder="Leave a note..."
              />
            </Localized>
            <Flex justifyContent="flex-end">
              <Localized id="moderate-user-drawer-notes-button">
                <Button variant="filled" color="primary" type="submit">
                  Add note
                </Button>
              </Localized>
            </Flex>
          </form>
        )}
      </Form>
      <HorizontalGutter size="double">
        {user.moderatorNotes &&
          user.moderatorNotes
            .concat()
            .reverse()
            .map(
              note =>
                note && (
                  <ModeratorNote
                    key={note.id}
                    id={note.id}
                    body={note.body}
                    moderator={note.createdBy.username}
                    createdAt={note.createdAt}
                    onDelete={
                      viewer && viewer.id === note.createdBy.id
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

const enhanced = withFragmentContainer<Props>({
  user: graphql`
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
  viewer: graphql`
    fragment UserDrawerNotesContainer_viewer on User {
      id
    }
  `,
})(UserDrawerNotesContainer);

export default enhanced;
