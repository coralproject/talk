import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FORM_ERROR, FormApi, FormState } from "final-form";
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
import { Environment } from "relay-runtime";

import { PasswordField } from "coral-framework/components";
import getAuthenticationIntegrations from "coral-framework/helpers/getAuthenticationIntegrations";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useViewerEvent } from "coral-framework/lib/events";
import { streamColorFromMeta } from "coral-framework/lib/form";
import {
  createFetch,
  useFetch,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validateEmail,
} from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import {
  ResendEmailVerificationEvent,
  ShowEditEmailDialogEvent,
} from "coral-stream/events";
import {
  Flex,
  FormField,
  HorizontalGutter,
  Icon,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";
import { Button, CallOut, ValidationMessage } from "coral-ui/components/v3";

import { ChangeEmailContainer_settings as SettingsData } from "coral-stream/__generated__/ChangeEmailContainer_settings.graphql";
import { ChangeEmailContainer_viewer as ViewerData } from "coral-stream/__generated__/ChangeEmailContainer_viewer.graphql";

import UpdateEmailMutation from "./UpdateEmailMutation";

import styles from "./ChangeEmailContainer.css";

const fetcher = createFetch(
  "resendConfirmation",
  async (environment: Environment, variables, { eventEmitter, rest }) => {
    const resendEmailVerificationEvent =
      ResendEmailVerificationEvent.begin(eventEmitter);
    try {
      const result = await rest.fetch<void>("/account/confirm", {
        method: "POST",
      });
      resendEmailVerificationEvent.success();
      return result;
    } catch (error) {
      resendEmailVerificationEvent.error({
        message: error.message,
        code: error.code,
      });
      throw error;
    }
  }
);

interface Props {
  viewer: ViewerData;
  settings: SettingsData;
}

interface FormProps {
  email: string;
  password: string;
}

const ChangeEmailContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
}) => {
  const newEmailRef = useRef<HTMLInputElement>(null);
  const emitShowEvent = useViewerEvent(ShowEditEmailDialogEvent);
  const updateEmail = useMutation(UpdateEmailMutation);

  const [showEditForm, setShowEditForm] = useState(false);
  const [confirmationResent, setConfirmationResent] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const makeFetchCall = useFetch(fetcher);
  const resend = useCallback(async () => {
    await makeFetchCall();
    setConfirmationResent(true);
  }, [fetcher]);

  const toggleEditForm = useCallback(() => {
    if (!showEditForm) {
      emitShowEvent();
    }
    setShowEditForm(!showEditForm);
  }, [setShowEditForm, showEditForm]);
  const onSubmit = useCallback(
    async (input: FormProps, form: FormApi) => {
      try {
        await updateEmail({
          email: input.email,
          password: input.password,
        });

        setShowSuccessMessage(true);
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }

        return {
          [FORM_ERROR]: err.message,
        };
      }

      setShowEditForm(false);

      return;
    },
    [updateEmail, setShowSuccessMessage]
  );
  const onCloseSuccess = useCallback(() => {
    setShowSuccessMessage(false);
  }, [setShowSuccessMessage]);

  const canChangeEmail = useMemo(() => {
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

  const preventSubmit = (
    formState: Pick<
      FormState<any>,
      | "pristine"
      | "hasSubmitErrors"
      | "hasValidationErrors"
      | "dirtySinceLastSubmit"
    >
  ) => {
    const {
      pristine,
      hasValidationErrors,
      hasSubmitErrors,
      dirtySinceLastSubmit,
    } = formState;
    return (
      pristine ||
      hasValidationErrors ||
      (hasSubmitErrors && !dirtySinceLastSubmit)
    );
  };

  useEffect(() => {
    if (newEmailRef.current) {
      newEmailRef.current.focus();
    }
  });

  return (
    <HorizontalGutter
      className={CLASSES.myEmail.email}
      data-testid="profile-changeEmail"
      container="section"
      aria-labelledby="profile-changeEmail-title"
    >
      <div className={cn(styles.footer, CLASSES.myEmail.form.footer)}>
        <Localized id="profile-changeEmail-title">
          <div
            className={cn(styles.title, CLASSES.myEmail.title)}
            id="profile-changeEmail-title"
          >
            Email address
          </div>
        </Localized>
        <Flex>
          <div
            className={cn(
              styles.currentEmail,
              CLASSES.myEmail.form.currentEmail
            )}
          >
            {viewer.email}
          </div>{" "}
          {!viewer.emailVerified && !showEditForm && (
            <Localized id="profile-changeEmail-unverified">
              <div
                className={cn(
                  styles.currentEmail,
                  CLASSES.myEmail.form.currentEmail
                )}
              >
                (Unverified)
              </div>
            </Localized>
          )}
          {showEditForm && (
            <Localized id="profile-changeEmail-current">
              <div
                className={cn(
                  styles.currentEmail,
                  CLASSES.myEmail.form.currentEmail
                )}
              >
                (current)
              </div>
            </Localized>
          )}
        </Flex>
      </div>
      {!viewer.emailVerified && !showEditForm && (
        <div
          className={cn(styles.verifyContainer, CLASSES.verifyEmail.container)}
        >
          <CallOut
            className={CLASSES.verifyEmail.$root}
            container="section"
            aria-labelledby="profile-changeEmail-pleaseVerify-title"
          >
            <Flex itemGutter>
              <div>
                <Icon size="lg">email</Icon>
              </div>
              <div>
                <div
                  className={cn(
                    styles.verifyContent,
                    CLASSES.verifyEmail.content
                  )}
                >
                  <div
                    className={cn(
                      styles.verifyTitle,
                      CLASSES.verifyEmail.title
                    )}
                  >
                    <Localized id="profile-changeEmail-please-verify">
                      <div id="profile-changeEmail-pleaseVerify-title">
                        Verify your email address
                      </div>
                    </Localized>
                  </div>
                  <Localized
                    id="profile-changeEmail-please-verify-details"
                    vars={{ email: viewer.email }}
                  >
                    <div>
                      An email has been sent to {viewer.email} to verify your
                      account. You must verify your new email address before it
                      can be used for signing into your account or for email
                      notifications.
                    </div>
                  </Localized>
                </div>
                <Localized id="profile-changeEmail-resend">
                  <Button
                    onClick={resend}
                    variant="flat"
                    color="primary"
                    paddingSize="none"
                    className={cn(
                      styles.resendButton,
                      CLASSES.verifyEmail.resendButton
                    )}
                  >
                    Resend verification
                  </Button>
                </Localized>
              </div>
            </Flex>
          </CallOut>
        </div>
      )}
      {canChangeEmail && !showEditForm && (
        <div
          className={cn({
            [styles.changeButton]: !showSuccessMessage,
            [styles.changeButtonMessage]: showSuccessMessage,
          })}
        >
          <Localized id="profile-changeEmail-change">
            <Button
              className={CLASSES.myEmail.editButton}
              variant="flat"
              paddingSize="none"
              onClick={toggleEditForm}
            >
              Change
            </Button>
          </Localized>
        </div>
      )}
      {showSuccessMessage && (
        <div className={styles.successMessage}>
          <CallOut
            color="success"
            onClose={onCloseSuccess}
            icon={<Icon size="sm">check_circle</Icon>}
            titleWeight="semiBold"
            title={
              <Localized id="profile-changeEmail-success">
                Your email has been successfully updated
              </Localized>
            }
            aria-live="polite"
          />
        </div>
      )}
      {confirmationResent && (
        <CallOut
          className={CLASSES.verifyEmail.resentMessage}
          color="mono"
          aria-live="polite"
        >
          <Localized id="profile-changeEmail-resent">
            <span>Your confirmation email has been re-sent.</span>
          </Localized>
        </CallOut>
      )}
      {showEditForm && (
        <HorizontalGutter spacing={4}>
          <div>
            <Localized id="profile-changeEmail-changeYourEmailAddress">
              <div className={cn(styles.header, CLASSES.myEmail.form.header)}>
                Change your email address
              </div>
            </Localized>
            <Localized id="profile-changeEmail-desc">
              <div
                className={cn(styles.description, CLASSES.myEmail.form.desc)}
              >
                Change the email address used for signing in and for receiving
                communication about your account.
              </div>
            </Localized>
          </div>
          <Form onSubmit={onSubmit}>
            {({
              handleSubmit,
              submitError,
              invalid,
              submitting,
              ...formProps
            }) => (
              <form
                onSubmit={handleSubmit}
                data-testid="profile-changeEmail-form"
              >
                <HorizontalGutter spacing={4}>
                  <FormField>
                    <HorizontalGutter>
                      <Localized id="profile-changeEmail-newEmail-label">
                        <InputLabel htmlFor="profile-changeEmail-Email">
                          New email address
                        </InputLabel>
                      </Localized>
                      <Field
                        name="email"
                        validate={composeValidators(required, validateEmail)}
                      >
                        {({ input, meta }) => (
                          <>
                            <TextField
                              {...input}
                              fullWidth
                              id="profile-changeEmail-Email"
                              color={streamColorFromMeta(meta)}
                              ref={newEmailRef}
                            />
                            <ValidationMessage
                              meta={meta}
                              className={CLASSES.validationMessage}
                            />
                          </>
                        )}
                      </Field>
                    </HorizontalGutter>
                  </FormField>
                  <FormField>
                    <HorizontalGutter>
                      <Field
                        name="password"
                        validate={composeValidators(required)}
                      >
                        {({ input, meta }) => (
                          <FormField>
                            <Localized id="profile-changeEmail-password">
                              <InputLabel htmlFor={input.name}>
                                Password
                              </InputLabel>
                            </Localized>
                            <Localized
                              id="profile-changeEmail-password-input"
                              attrs={{ placeholder: true }}
                            >
                              <PasswordField
                                {...input}
                                id={input.name}
                                placeholder="Password"
                                color={streamColorFromMeta(meta)}
                                disabled={submitting}
                                fullWidth
                              />
                            </Localized>
                            <ValidationMessage
                              meta={meta}
                              className={CLASSES.validationMessage}
                            />
                          </FormField>
                        )}
                      </Field>
                    </HorizontalGutter>
                  </FormField>
                  {submitError && (
                    <CallOut
                      className={CLASSES.myEmail.form.errorMessage}
                      color="error"
                      icon={<Icon size="sm">error</Icon>}
                      titleWeight="semiBold"
                      title={<span>{submitError}</span>}
                      role="alert"
                    />
                  )}
                </HorizontalGutter>
                <Flex
                  justifyContent="flex-start"
                  alignItems="center"
                  className={cn(styles.footer, CLASSES.myEmail.form.footer)}
                >
                  <Localized id="profile-changeEmail-cancel">
                    <Button
                      className={cn(
                        styles.footerButton,
                        CLASSES.myEmail.form.cancelButton
                      )}
                      type="button"
                      onClick={toggleEditForm}
                      variant="outlined"
                      color="secondary"
                      upperCase
                    >
                      Cancel
                    </Button>
                  </Localized>
                  <Localized id="profile-changeEmail-saveChanges">
                    <Button
                      className={cn(
                        styles.footerButton,
                        CLASSES.myEmail.form.saveButton
                      )}
                      variant="filled"
                      type="submit"
                      color="primary"
                      disabled={preventSubmit(formProps)}
                      upperCase
                    >
                      Save changes
                    </Button>
                  </Localized>
                </Flex>
              </form>
            )}
          </Form>
        </HorizontalGutter>
      )}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment ChangeEmailContainer_viewer on User {
      email
      emailVerified
      profiles {
        __typename
      }
    }
  `,
  settings: graphql`
    fragment ChangeEmailContainer_settings on Settings {
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
})(ChangeEmailContainer);

export default enhanced;
