import cn from "classnames";
import { FORM_ERROR, FormApi } from "final-form";
import { Localized } from "fluent-react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Field, Form } from "react-final-form";

import { ALLOWED_USERNAME_CHANGE_FREQUENCY } from "coral-common/constants";
import { reduceSeconds, UNIT } from "coral-common/helpers/i18n";
import getAuthenticationIntegrations from "coral-framework/helpers/getAuthenticationIntegrations";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { InvalidRequestError } from "coral-framework/lib/errors";
import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validateUsername,
  validateUsernameEquals,
} from "coral-framework/lib/validation";
import { ChangeUsernameContainer_settings as SettingsData } from "coral-stream/__generated__/ChangeUsernameContainer_settings.graphql";
import { ChangeUsernameContainer_viewer as ViewerData } from "coral-stream/__generated__/ChangeUsernameContainer_viewer.graphql";
import CLASSES from "coral-stream/classes";
import FieldValidationMessage from "coral-stream/common/FieldValidationMessage";
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

import UpdateUsernameMutation from "./UpdateUsernameMutation";

import styles from "./ChangeUsernameContainer.css";

const FREQUENCYSCALED = reduceSeconds(ALLOWED_USERNAME_CHANGE_FREQUENCY, [
  UNIT.DAYS,
]);

interface Props {
  viewer: ViewerData;
  settings: SettingsData;
}

interface FormProps {
  username: string;
  usernameConfirm: string;
}

const ChangeUsernameContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
}) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const toggleEditForm = useCallback(() => {
    setShowEditForm(!showEditForm);
  }, [setShowEditForm, showEditForm]);
  const updateUsername = useMutation(UpdateUsernameMutation);

  const closeSuccessMessage = useCallback(() => setShowSuccessMessage(false), [
    setShowEditForm,
  ]);

  const canChangeLocalAuth = useMemo(() => {
    if (
      !viewer.profiles.find(profile => profile.__typename === "LocalProfile")
    ) {
      return false;
    }
    const enabled = getAuthenticationIntegrations(settings.auth, "stream");

    return (
      enabled.includes("local") ||
      !(enabled.length === 1 && enabled[0] === "sso")
    );
  }, [viewer, settings]);

  const canChangeUsername = useMemo(() => {
    const { username } = viewer.status;
    if (username && username.history.length > 1) {
      const lastUsernameEditAllowed = new Date();
      lastUsernameEditAllowed.setSeconds(
        lastUsernameEditAllowed.getSeconds() - ALLOWED_USERNAME_CHANGE_FREQUENCY
      );
      const lastUsernameEdit =
        username.history[username.history.length - 1].createdAt;
      return lastUsernameEdit > lastUsernameEditAllowed;
    }
    return true;
  }, [viewer]);

  const canChangeUsernameDate = useMemo(() => {
    const { username } = viewer.status;
    if (username && username.history.length > 1) {
      const date = new Date(
        username.history[username.history.length - 1].createdAt
      );
      date.setSeconds(date.getSeconds() + ALLOWED_USERNAME_CHANGE_FREQUENCY);
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
    <HorizontalGutter spacing={5} data-testid="profile-changeUsername">
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
        <Flex alignItems="baseline">
          <Typography variant="header2" className={CLASSES.myUsername.username}>
            {viewer.username}
          </Typography>
          {canChangeLocalAuth && settings.accountFeatures.changeUsername && (
            <Localized id="profile-changeUsername-edit">
              <Button
                className={CLASSES.myUsername.editButton}
                size="small"
                color="primary"
                onClick={toggleEditForm}
              >
                Edit
              </Button>
            </Localized>
          )}
        </Flex>
      )}
      {showEditForm && (
        <CallOut
          className={cn(styles.callOut, CLASSES.myUsername.form.$root)}
          color="primary"
        >
          <HorizontalGutter spacing={4}>
            <div>
              <Localized id="profile-changeUsername-heading">
                <Typography variant="heading2" gutterBottom>
                  Edit your username
                </Typography>
              </Localized>
              <Localized
                id="profile-changeUsername-desc"
                strong={<strong />}
                $value={FREQUENCYSCALED.scaled}
                $unit={FREQUENCYSCALED.unit}
              >
                <Typography>
                  Change the username that will appear on all of your past and
                  future comments.{" "}
                  <strong>
                    Usernames can be changed once every {FREQUENCYSCALED.scaled}{" "}
                    {FREQUENCYSCALED.unit}.
                  </strong>
                </Typography>
              </Localized>
            </div>
            <div>
              <Localized id="profile-changeUsername-current">
                <Typography
                  className={cn(
                    styles.currentUsername,
                    CLASSES.myUsername.form.username
                  )}
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
                  <form
                    onSubmit={handleSubmit}
                    data-testid="profile-changeUsername-form"
                  >
                    <HorizontalGutter spacing={4}>
                      <FormField>
                        <HorizontalGutter>
                          <Localized id="profile-changeUsername-newUsername-label">
                            <InputLabel htmlFor="profile-changeUsername-username">
                              New username
                            </InputLabel>
                          </Localized>
                          <Field
                            name="username"
                            validate={composeValidators(
                              required,
                              validateUsername
                            )}
                            id="profile-changeUsername-username"
                          >
                            {({ input, meta }) => (
                              <>
                                <TextField
                                  {...input}
                                  id="profile-changeUsername-username"
                                />
                                <FieldValidationMessage meta={meta} />
                              </>
                            )}
                          </Field>
                        </HorizontalGutter>
                      </FormField>
                      <FormField>
                        <HorizontalGutter>
                          <Localized id="profile-changeUsername-confirmNewUsername-label">
                            <InputLabel htmlFor="profile-changeUsername-username-confirm">
                              Confirm new username
                            </InputLabel>
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
                                <TextField
                                  {...input}
                                  id="profile-changeUsername-username-confirm"
                                />
                                <FieldValidationMessage meta={meta} />
                              </>
                            )}
                          </Field>
                        </HorizontalGutter>
                      </FormField>
                      {submitError && (
                        <CallOut
                          className={CLASSES.myUsername.form.errorMessage}
                          color="error"
                          fullWidth
                        >
                          {submitError}
                        </CallOut>
                      )}
                    </HorizontalGutter>
                    <Flex justifyContent="flex-end" className={styles.footer}>
                      <Localized id="profile-changeUsername-cancel">
                        <Button
                          className={CLASSES.myUsername.form.cancelButton}
                          type="button"
                          onClick={toggleEditForm}
                        >
                          Cancel
                        </Button>
                      </Localized>
                      <Localized
                        id="profile-changeUsername-submit"
                        ButtonIcon={<ButtonIcon>save</ButtonIcon>}
                        span={<span />}
                      >
                        <Button
                          className={CLASSES.myUsername.form.saveButton}
                          variant={pristine || invalid ? "outlined" : "filled"}
                          type="submit"
                          data-testid="profile-changeUsername-save"
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
              <div data-testid="profile-changeUsername-cantChange">
                <Flex>
                  <Icon size="md" className={styles.errorIcon}>
                    error
                  </Icon>
                  <Localized
                    date={canChangeUsernameDate}
                    id="profile-changeUsername-recentChange"
                    $value={FREQUENCYSCALED.scaled}
                    $unit={FREQUENCYSCALED.unit}
                    $nextUpdate={
                      canChangeUsernameDate
                        ? formatter.format(canChangeUsernameDate)
                        : null
                    }
                  >
                    <Typography className={styles.tooSoon}>
                      Your username has been changed in the last{" "}
                      {FREQUENCYSCALED.scaled} {FREQUENCYSCALED.unit}. You may
                      change your username again on{" "}
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
                      className={CLASSES.myUsername.form.closeButton}
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
      profiles {
        __typename
      }
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
  settings: graphql`
    fragment ChangeUsernameContainer_settings on Settings {
      accountFeatures {
        changeUsername
      }
      auth {
        integrations {
          local {
            enabled
            targetFilter {
              stream
            }
          }
          google {
            enabled
            targetFilter {
              stream
            }
          }
          oidc {
            enabled
            targetFilter {
              stream
            }
          }
          sso {
            enabled
            targetFilter {
              stream
            }
          }
          facebook {
            enabled
            targetFilter {
              stream
            }
          }
        }
      }
    }
  `,
})(ChangeUsernameContainer);

export default enhanced;
