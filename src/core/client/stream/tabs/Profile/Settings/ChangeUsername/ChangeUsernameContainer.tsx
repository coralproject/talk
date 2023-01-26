import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FORM_ERROR, FormApi } from "final-form";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { ALLOWED_USERNAME_CHANGE_TIMEFRAME_DURATION } from "coral-common/constants";
import { reduceSeconds } from "coral-common/helpers/i18n";
import TIME from "coral-common/time";
import getAuthenticationIntegrations from "coral-framework/helpers/getAuthenticationIntegrations";
import { useDateTimeFormatter } from "coral-framework/hooks";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useViewerEvent } from "coral-framework/lib/events";
import { streamColorFromMeta } from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validateUsername,
  validateUsernameEquals,
} from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import { ShowEditUsernameDialogEvent } from "coral-stream/events";
import {
  FormField,
  HorizontalGutter,
  Icon,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";
import { Button, CallOut, ValidationMessage } from "coral-ui/components/v3";

import { ChangeUsernameContainer_settings as SettingsData } from "coral-stream/__generated__/ChangeUsernameContainer_settings.graphql";
import { ChangeUsernameContainer_viewer as ViewerData } from "coral-stream/__generated__/ChangeUsernameContainer_viewer.graphql";

import UpdateUsernameMutation from "./UpdateUsernameMutation";

import styles from "./ChangeUsernameContainer.css";

const FREQUENCYSCALED = reduceSeconds(
  ALLOWED_USERNAME_CHANGE_TIMEFRAME_DURATION,
  [TIME.DAY]
);

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
  const newUsernameRef = useRef<HTMLInputElement>(null);
  const emitShowEditUsernameDialog = useViewerEvent(
    ShowEditUsernameDialogEvent
  );
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const toggleEditForm = useCallback(() => {
    if (!showEditForm) {
      emitShowEditUsernameDialog();
    }
    setShowEditForm(!showEditForm);
  }, [setShowEditForm, showEditForm]);
  const updateUsername = useMutation(UpdateUsernameMutation);

  const closeSuccessMessage = useCallback(
    () => setShowSuccessMessage(false),
    [setShowEditForm]
  );

  const canChangeLocalAuth = useMemo(() => {
    if (!settings.accountFeatures.changeUsername) {
      return false;
    }
    if (
      !viewer.profiles.find((profile) => profile.__typename === "LocalProfile")
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
        lastUsernameEditAllowed.getSeconds() -
          ALLOWED_USERNAME_CHANGE_TIMEFRAME_DURATION
      );
      const lastUsernameEdit = new Date(
        username.history[username.history.length - 1].createdAt
      );
      return lastUsernameEdit <= lastUsernameEditAllowed;
    }
    return true;
  }, [viewer]);

  const canChangeUsernameDate = useMemo(() => {
    const { username } = viewer.status;
    if (username && username.history.length > 1) {
      const date = new Date(
        username.history[username.history.length - 1].createdAt
      );
      date.setSeconds(
        date.getSeconds() + ALLOWED_USERNAME_CHANGE_TIMEFRAME_DURATION
      );
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

      setShowEditForm(false);
      setShowSuccessMessage(true);

      return;
    },
    [updateUsername]
  );

  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
    if (newUsernameRef.current) {
      newUsernameRef.current.focus();
    }
  });

  return (
    <HorizontalGutter
      spacing={3}
      data-testid="profile-changeUsername"
      container="section"
      aria-labelledby="profile-changeUsername-title"
    >
      <div>
        <Localized id="profile-changeUsername-username">
          <div
            className={cn(styles.title, CLASSES.myUsername.title)}
            id="profile-changeUsername-title"
          >
            Username
          </div>
        </Localized>
        <div className={cn(styles.username, CLASSES.myUsername.username)}>
          {viewer.username}
        </div>
      </div>
      {canChangeLocalAuth && !showEditForm && (
        <div
          className={cn({
            [styles.changeButton]: canChangeUsername && !showSuccessMessage,
            [styles.changeButtonMessage]:
              !canChangeUsername || showSuccessMessage,
          })}
        >
          <Localized id="profile-changeUsername-change">
            <Button
              className={cn(
                CLASSES.myUsername.editButton,
                CLASSES.myUsername.change
              )}
              variant="flat"
              paddingSize="none"
              color="primary"
              onClick={toggleEditForm}
              disabled={!canChangeUsername}
            >
              Change
            </Button>
          </Localized>
        </div>
      )}
      {showSuccessMessage && (
        <div
          className={cn(
            styles.successMessage,
            CLASSES.myUsername.form.successMessage
          )}
        >
          <CallOut
            color="success"
            onClose={closeSuccessMessage}
            className={cn(CLASSES.myUsername.form.successCallOut)}
            icon={<Icon size="sm">check_circle</Icon>}
            titleWeight="semiBold"
            title={
              <Localized id="profile-changeUsername-success">
                <span>Your username has been successfully updated</span>
              </Localized>
            }
            aria-live="polite"
          />
        </div>
      )}
      {!canChangeUsername && !showSuccessMessage && (
        <div data-testid="profile-changeUsername-cantChange">
          <Localized
            id="profile-changeUsername-youChangedYourUsernameWithin"
            vars={{
              date: canChangeUsernameDate || "",
              value: FREQUENCYSCALED.scaled,
              unit: FREQUENCYSCALED.unit,
              nextUpdate: canChangeUsernameDate
                ? formatter(canChangeUsernameDate)
                : "",
            }}
          >
            <div className={cn(styles.tooSoon, CLASSES.myUsername.tooSoon)}>
              You changed your username within the last {FREQUENCYSCALED.scaled}{" "}
              {FREQUENCYSCALED.unit}. You may change your username again on:{" "}
              {canChangeUsernameDate ? formatter(canChangeUsernameDate) : null}.
            </div>
          </Localized>
        </div>
      )}
      {showEditForm && (
        <HorizontalGutter spacing={4}>
          <div>
            <Localized id="profile-changeUsername-heading-changeYourUsername">
              <div
                className={cn(styles.heading, CLASSES.myUsername.form.heading)}
              >
                Change your username
              </div>
            </Localized>
            <Localized
              id="profile-changeUsername-desc-text"
              vars={{
                value: FREQUENCYSCALED.scaled,
                unit: FREQUENCYSCALED.unit,
              }}
            >
              <div
                className={cn(
                  styles.description,
                  CLASSES.myUsername.form.description
                )}
              >
                Change the username that will appear on all of your past and
                future comments. Usernames can be changed once every{" "}
                {FREQUENCYSCALED.scaled} {FREQUENCYSCALED.unit}.
              </div>
            </Localized>
          </div>
          {canChangeUsername && (
            <Form onSubmit={onSubmit}>
              {({
                handleSubmit,
                submitError,
                pristine,
                invalid,
                dirtySinceLastSubmit,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  data-testid="profile-changeUsername-form"
                >
                  <HorizontalGutter spacing={4}>
                    <FormField>
                      <Field
                        name="username"
                        validate={composeValidators(required, validateUsername)}
                      >
                        {({ input, meta }) => (
                          <>
                            <Localized id="profile-changeUsername-newUsername-label">
                              <InputLabel htmlFor={input.name}>
                                New username
                              </InputLabel>
                            </Localized>
                            <TextField
                              {...input}
                              fullWidth
                              id={input.name}
                              data-testid="profile-changeUsername-username"
                              color={streamColorFromMeta(meta)}
                              ref={newUsernameRef}
                            />
                            <ValidationMessage
                              className={CLASSES.validationMessage}
                              meta={meta}
                            />
                          </>
                        )}
                      </Field>
                    </FormField>
                    <FormField>
                      <Field
                        name="usernameConfirm"
                        validate={composeValidators(
                          required,
                          validateUsernameEquals
                        )}
                        id="profile-changeUsername-username-confirm"
                      >
                        {({ input, meta }) => (
                          <>
                            <Localized id="profile-changeUsername-confirmNewUsername-label">
                              <InputLabel htmlFor={input.name}>
                                Confirm new username
                              </InputLabel>
                            </Localized>
                            <TextField
                              {...input}
                              fullWidth
                              id={input.name}
                              data-testid="profile-changeUsername-username-confirm"
                              color={streamColorFromMeta(meta)}
                            />
                            <ValidationMessage
                              className={CLASSES.validationMessage}
                              meta={meta}
                            />
                          </>
                        )}
                      </Field>
                    </FormField>
                    {submitError && (
                      <CallOut
                        color="error"
                        className={CLASSES.myUsername.form.errorMessage}
                        icon={<Icon size="sm">error</Icon>}
                        titleWeight="semiBold"
                        title={submitError}
                        role="alert"
                      />
                    )}
                  </HorizontalGutter>
                  <div
                    className={cn(
                      styles.footer,
                      CLASSES.myUsername.form.footer
                    )}
                  >
                    <Localized id="profile-changeUsername-cancel">
                      <Button
                        className={cn(
                          styles.footerButton,
                          CLASSES.myUsername.form.cancelButton
                        )}
                        type="button"
                        variant="outlined"
                        color="secondary"
                        onClick={toggleEditForm}
                        upperCase
                      >
                        Cancel
                      </Button>
                    </Localized>
                    <Localized id="profile-changeUsername-saveChanges">
                      <Button
                        className={cn(
                          styles.footerButton,
                          CLASSES.myUsername.form.saveButton
                        )}
                        variant="filled"
                        type="submit"
                        data-testid="profile-changeUsername-save"
                        color="primary"
                        disabled={
                          pristine || (invalid && !dirtySinceLastSubmit)
                        }
                        upperCase
                      >
                        <span>Save Changes</span>
                      </Button>
                    </Localized>
                  </div>
                </form>
              )}
            </Form>
          )}
        </HorizontalGutter>
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
