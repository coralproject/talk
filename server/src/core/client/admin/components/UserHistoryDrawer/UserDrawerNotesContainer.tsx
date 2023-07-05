import { Localized } from "@fluent/react/compat";
import { FormApi } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
import {
  Button,
  Divider,
  Flex,
  HorizontalGutter,
  Textarea,
} from "coral-ui/components/v2";

import { UserDrawerNotesContainer_user as UserData } from "coral-admin/__generated__/UserDrawerNotesContainer_user.graphql";
import { UserDrawerNotesContainer_viewer as ViewerData } from "coral-admin/__generated__/UserDrawerNotesContainer_viewer.graphql";

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
    async ({ body }: { body: string }, form: FormApi) => {
      await createNote({
        userID: user.id,
        body,
      });
      form.initialize({});
    },
    [user]
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
        {user.moderatorNotes &&
          user.moderatorNotes
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
