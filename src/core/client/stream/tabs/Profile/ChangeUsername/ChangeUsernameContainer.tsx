import { useCoralContext } from "coral-framework/lib/bootstrap";
import { FORM_ERROR, FormApi } from "final-form";
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
  composeValidators,
  required,
  validateUsernameEquals,
} from "coral-framework/lib/validation";
import {
  Box,
  Button,
  ButtonIcon,
  CallOut,
  CardCloseButton,
  Flex,
  FormField,
  HorizontalGutter,
  Icon,
  InputLabel,
  TextField,
  Typography,
} from "coral-ui/components";

import { ValidationMessage } from "coral-framework/lib/form";

import { ChangeUsernameContainer_viewer as ViewerData } from "coral-stream/__generated__/ChangeUsernameContainer_viewer.graphql";
import UpdateUsernameMutation from "./UpdateUsernameMutation";

import styles from "./ChangeUsername.css";

interface Props {
  viewer: ViewerData;
}

interface FormProps {
  username: string;
  usernameConfirm: string;
}

const ChangeUsernameContainer: FunctionComponent<Props> = ({ viewer }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const toggleEditForm = useCallback(() => {
    setShowEditForm(!showEditForm);
  }, [setShowEditForm, showEditForm]);
  const updateUsername = useMutation(UpdateUsernameMutation);

  const closeSuccessMessage = useCallback(() => setShowSuccessMessage(false), [
    setShowEditForm,
  ]);

  const canChangeUsername = useMemo(() => {
    const { username } = viewer.status;
    if (username && username.history.length > 0) {
      const lastUsernameEditAllowed = new Date();
      const dateDiff = lastUsernameEditAllowed.getDate() - 14;
      lastUsernameEditAllowed.setDate(dateDiff);
      return username.history.find(history => {
        return history.createdAt > lastUsernameEditAllowed;
      });
    }
    return true;
  }, [viewer]);

  const canChangeUsernameDate = useMemo(() => {
    const { username } = viewer.status;
    if (username && username.history.length > 0) {
      const date = new Date(
        username.history[username.history.length - 1].createdAt
      );
      const diff = date.getDate() + 14;
      date.setDate(diff);
      return date;
    }
    return null;
  }, [viewer]);

  const onSubmit = useCallback(
    async (input: FormProps, form: FormApi) => {
      try {
        await updateUsername({
          username: input.username,
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
      setShowEditForm(false);
      setShowSuccessMessage(true);

      return;
    },
    [updateUsername]
  );

  const { locales } = useCoralContext();

  const formatter = new Intl.DateTimeFormat(locales, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <HorizontalGutter spacing={5}>
      {showSuccessMessage && (
        <Box className={styles.successMessage}>
          <Flex justifyContent="space-between" alignItems="center">
            <Localized id="profile-changeUsername-success">
              <Typography>
                Your username has been successfully updated
              </Typography>
            </Localized>
            <CardCloseButton
              className={styles.closeButton}
              onClick={closeSuccessMessage}
            />
          </Flex>
        </Box>
      )}
      {!showEditForm && (
        <Flex alignItems="center">
          <Typography variant="header2">{viewer.username}</Typography>
          <Localized id="profile-changeUsername-edit">
            <Button size="small" color="primary" onClick={toggleEditForm}>
              Edit
            </Button>
          </Localized>
        </Flex>
      )}
      {showEditForm && (
        <CallOut className={styles.callOut} color="primary">
          <HorizontalGutter spacing={4}>
            <div>
              <Localized id="profile-changeUsername-heading">
                <Typography variant="heading2" gutterBottom>
                  Edit your username
                </Typography>
              </Localized>
              <Localized id="profile-changeUsername-desc">
                <Typography>
                  Change the username that will appear on all of your past and
                  future comments. Usernames can be changed once every 14 days.
                </Typography>
              </Localized>
            </div>
            <div>
              <Localized id="profile-changeUsername-current">
                <Typography
                  className={styles.currentUsername}
                  variant="bodyCopyBold"
                >
                  Current username
                </Typography>
              </Localized>
              <Typography variant="heading2">{viewer.username}</Typography>
            </div>
            {canChangeUsername && (
              <Form onSubmit={onSubmit}>
                {({ handleSubmit, submitError, pristine, invalid }) => (
                  <form onSubmit={handleSubmit}>
                    <HorizontalGutter spacing={4}>
                      <FormField>
                        <HorizontalGutter>
                          <Localized id="profile-changeUsername-newUsername-label">
                            <InputLabel>New username</InputLabel>
                          </Localized>
                          <Field name="username" validate={required}>
                            {({ input, meta }) => (
                              <>
                                <TextField {...input} />
                                <ValidationMessage meta={meta} />
                              </>
                            )}
                          </Field>
                        </HorizontalGutter>
                      </FormField>
                      <FormField>
                        <HorizontalGutter>
                          <Localized id="profile-changeUsername-confirmNewUsername-label">
                            <InputLabel>Confirm new username</InputLabel>
                          </Localized>
                          <Field
                            name="usernameConfirm"
                            validate={composeValidators(
                              required,
                              validateUsernameEquals
                            )}
                          >
                            {({ input, meta }) => (
                              <>
                                <TextField {...input} />
                                <ValidationMessage meta={meta} />
                              </>
                            )}
                          </Field>
                        </HorizontalGutter>
                      </FormField>
                    </HorizontalGutter>
                    {submitError && (
                      <CallOut color="error" fullWidth>
                        {submitError}
                      </CallOut>
                    )}
                    <Flex justifyContent="flex-end" className={styles.footer}>
                      <Localized id="profile-changeUsername-cancel">
                        <Button type="button" onClick={toggleEditForm}>
                          Cancel
                        </Button>
                      </Localized>
                      <Localized id="profile-changeUsername-submit">
                        <Button
                          variant={pristine || invalid ? "outlined" : "filled"}
                          type="submit"
                          color={pristine || invalid ? "regular" : "primary"}
                          disabled={pristine || invalid}
                        >
                          <ButtonIcon>save</ButtonIcon>
                          <span>Save</span>
                        </Button>
                      </Localized>
                    </Flex>
                  </form>
                )}
              </Form>
            )}
            {!canChangeUsername && (
              <div>
                <Flex>
                  <Icon size="md" className={styles.errorIcon}>
                    error
                  </Icon>
                  <Localized
                    date={canChangeUsernameDate}
                    id="profile-changeUsername-recentChange"
                    $nextUpdate={
                      canChangeUsernameDate
                        ? formatter.format(canChangeUsernameDate)
                        : null
                    }
                  >
                    <Typography className={styles.tooSoon}>
                      Your username has been changed in the last 14 days. You
                      may change your username again on{" "}
                      {canChangeUsernameDate
                        ? formatter.format(canChangeUsernameDate)
                        : null}
                    </Typography>
                  </Localized>
                </Flex>
                <Flex justifyContent="flex-end">
                  <Localized id="profile-changeUsername-close">
                    <Button
                      color="primary"
                      variant="filled"
                      type="button"
                      onClick={toggleEditForm}
                    >
                      Close
                    </Button>
                  </Localized>
                </Flex>
              </div>
            )}
          </HorizontalGutter>
        </CallOut>
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
