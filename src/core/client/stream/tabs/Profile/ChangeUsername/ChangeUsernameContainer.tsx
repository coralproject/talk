import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Field, Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { graphql, useMutation } from "coral-framework/lib/relay";
import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import { ChangeUsernameContainer_viewer as ViewerData } from "coral-stream/__generated__/ChangeUsernameContainer_viewer.graphql";
import UpdateUsernameMutation from "./UpdateUsernameMutation";

interface Props {
  viewer: ViewerData;
}

interface FormProps {
  newUsername: string;
  newUsernameConfirm: string;
}

interface ErrorProps {
  newUsername?: string;
  newUsernameConfirm?: string;
}

const ChangeUsernameContainer: FunctionComponent<Props> = ({ viewer }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const toggleEditForm = useCallback(() => {
    setShowEditForm(!showEditForm);
  }, [setShowEditForm, showEditForm]);
  const updateUsername = useMutation(UpdateUsernameMutation);

  const canChangeUsername = useMemo(() => {
    const lastUsernameEditAllowed = new Date();
    const dateDiff = lastUsernameEditAllowed.getDate() - 14;
    lastUsernameEditAllowed.setDate(dateDiff);
    return viewer.status.username
      ? viewer.status.username.history.find(history => {
          return history.createdAt > lastUsernameEditAllowed;
        })
      : false;
  }, [viewer]);

  const canChangeUsernameDate = useMemo(() => {
    const { username } = viewer.status;
    if (username && username.history.length > 0) {
      return username.history[username.history.length - 1].createdAt;
    }
    return null;
  }, [viewer]);

  const onSubmit = useCallback(
    async (input, form) => {
      try {
        await updateUsername({
          username: input.newUsername,
        });
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }

        return {
          [FORM_ERROR]: err.message,
        };
      }

      form.reset();

      return;
    },
    [updateUsername]
  );

  const validate = useCallback((values: FormProps): ErrorProps => {
    const errors: ErrorProps = {};
    if (!values.newUsername) {
      errors.newUsername = "Required";
    }
    if (!values.newUsernameConfirm) {
      errors.newUsernameConfirm = "Required";
    }
    if (values.newUsername !== values.newUsernameConfirm) {
      errors.newUsernameConfirm = "Values must match";
    }
    return errors;
  }, []);

  return (
    <HorizontalGutter spacing={5}>
      <Typography>{viewer.username}</Typography>
      {!showEditForm && (
        <Localized id="changeUsername-edit">
          <Button onClick={toggleEditForm}>Edit</Button>
        </Localized>
      )}
      {showEditForm && (
        <div>
          <Localized id="changeUsername-heading">
            <Typography>Edit your username</Typography>
          </Localized>
          <Localized id="changeUsername-desc">
            <Typography>
              Change the username will appear on all of your past and future
              comments. Usernames can be changed once every 14 days.
            </Typography>
          </Localized>
          <Localized id="changeUsername-current">
            <Typography>Current username</Typography>
          </Localized>
          <Typography>{viewer.username}</Typography>
          {canChangeUsername && (
            <Form onSubmit={onSubmit} validate={validate}>
              {({ handleSubmit, submitError, pristine, invalid }) => (
                <form onSubmit={handleSubmit}>
                  <Localized id="changeUsername-newInput">
                    <Field placeholder="new username" name="newUsername">
                      {({ input, meta }) => (
                        <div>
                          <label>New username</label>
                          <input type="text" {...input} />
                          {meta.touched && meta.error && (
                            <span>{meta.error}</span>
                          )}
                        </div>
                      )}
                    </Field>
                  </Localized>
                  <Localized id="changeUsername-newInputConfirm">
                    <Field
                      placeholder="confirm username"
                      name="newUsernameConfirm"
                    >
                      {({ input, meta }) => (
                        <div>
                          <label>Confirm username</label>
                          <input type="text" {...input} />
                          {meta.touched && meta.error && (
                            <span>{meta.error}</span>
                          )}
                        </div>
                      )}
                    </Field>
                  </Localized>
                  {submitError && (
                    <CallOut color="error" fullWidth>
                      {submitError}
                    </CallOut>
                  )}
                  <Button type="submit" disabled={pristine || invalid}>
                    Submit
                  </Button>
                </form>
              )}
            </Form>
          )}
          {!canChangeUsername && (
            <div>
              <Localized
                date={canChangeUsernameDate}
                id="changeUsername-recentChange"
              >
                <Typography>
                  Your username has been changed in the last 14 days. You may
                  change your username again on {canChangeUsernameDate}
                </Typography>
              </Localized>
            </div>
          )}
        </div>
      )}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment ChangeUsernameContainer_viewer on User {
      username
      status {
        username {
          history {
            username
            createdAt
          }
        }
      }
    }
  `,
})(ChangeUsernameContainer);

export default enhanced;
