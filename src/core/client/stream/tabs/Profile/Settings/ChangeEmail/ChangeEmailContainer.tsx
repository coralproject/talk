import cn from "classnames";
import { FORM_ERROR, FormApi, FormState } from "final-form";
import { Localized } from "fluent-react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Field, Form } from "react-final-form";
import { Environment } from "relay-runtime";

import { PasswordField } from "coral-framework/components";
import getAuthenticationIntegrations from "coral-framework/helpers/getAuthenticationIntegrations";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { colorFromMeta } from "coral-framework/lib/form";
import { createFetch, useFetch } from "coral-framework/lib/relay";
import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validateEmail,
} from "coral-framework/lib/validation";
import { ChangeEmailContainer_settings as SettingsData } from "coral-stream/__generated__/ChangeEmailContainer_settings.graphql";
import { ChangeEmailContainer_viewer as ViewerData } from "coral-stream/__generated__/ChangeEmailContainer_viewer.graphql";
import CLASSES from "coral-stream/classes";
import FieldValidationMessage from "coral-stream/common/FieldValidationMessage";
import {
  Button,
  ButtonIcon,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  Icon,
  InputLabel,
  TextField,
  Typography,
} from "coral-ui/components";

import UpdateEmailMutation from "./UpdateEmailMutation";

import styles from "./ChangeEmailContainer.css";

const fetcher = createFetch(
  "resendConfirmation",
  (environment: Environment, variables, context) => {
    return context.rest.fetch<void>("/account/confirm", {
      method: "POST",
    });
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

const changeEmailContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
}) => {
  const updateEmail = useMutation(UpdateEmailMutation);

  const [showEditForm, setShowEditForm] = useState(false);
  const [confirmationResent, setConfirmationResent] = useState(false);
  const makeFetchCall = useFetch(fetcher);
  const resend = useCallback(async () => {
    await makeFetchCall();
    setConfirmationResent(true);
  }, [fetcher]);

  const toggleEditForm = useCallback(() => {
    setShowEditForm(!showEditForm);
  }, [setShowEditForm, showEditForm]);
  const onSubmit = useCallback(
    async (input: FormProps, form: FormApi) => {
      try {
        await updateEmail({
          email: input.email,
          password: input.password,
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

      return;
    },
    [updateEmail]
  );

  const canChangeEmail = useMemo(() => {
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

  const preventSubmit = (
    formState: Pick<
      FormState,
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

  return (
    <HorizontalGutter
      className={CLASSES.myEmail.email}
      spacing={5}
      data-testid="profile-changeEmail"
    >
      {!showEditForm && (
        <Flex alignItems="center" justifyContent="space-between">
          <div>
            <Localized id="profile-changeEmail-email">
              <Typography color="textDark" variant="heading2">
                Email
              </Typography>
            </Localized>
            <Flex>
              <Typography>{viewer.email}</Typography>{" "}
              {!viewer.emailVerified && (
                <Localized id="profile-changeEmail-unverified">
                  <Typography
                    color="textSecondary"
                    className={CLASSES.myEmail.unverified}
                  >
                    (Unverified)
                  </Typography>
                </Localized>
              )}
            </Flex>
          </div>
          {canChangeEmail && (
            <Localized id="profile-changeEmail-edit">
              <Button
                className={CLASSES.myEmail.editButton}
                variant="outlineFilled"
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
      {!viewer.emailVerified && !showEditForm && (
        <CallOut className={CLASSES.verifyEmail.$root}>
          <Flex itemGutter>
            <div>
              <Icon size="lg">email</Icon>
            </div>
            <div>
              <Localized id="profile-changeEmail-please-verify">
                <Typography variant="heading3" gutterBottom>
                  Verify your email address
                </Typography>
              </Localized>
              <Localized
                id="profile-changeEmail-please-verify-details"
                $email={viewer.email}
              >
                <Typography>
                  An email has been sent to {viewer.email} to verify your
                  account. You must verify your new email address before it can
                  be used for signing into your account or for email
                  notifications.
                </Typography>
              </Localized>

              <Localized id="profile-changeEmail-resend">
                <Button
                  onClick={resend}
                  className={cn(
                    styles.resendButton,
                    CLASSES.verifyEmail.resendButton
                  )}
                  color="primary"
                >
                  Resend verification
                </Button>
              </Localized>
            </div>
          </Flex>
        </CallOut>
      )}
      {confirmationResent && (
        <CallOut
          className={CLASSES.verifyEmail.resentMessage}
          fullWidth
          color="primary"
        >
          <Localized id="profile-changeEmail-resent">
            <Typography>Your confirmation email has been re-sent.</Typography>
          </Localized>
        </CallOut>
      )}
      {showEditForm && (
        <CallOut
          className={cn(styles.callOut, CLASSES.myEmail.form.$root)}
          color="primary"
          borderless
        >
          <HorizontalGutter spacing={4}>
            <div>
              <Localized id="profile-changeEmail-heading">
                <Typography variant="heading1" color="textDark" gutterBottom>
                  Edit your email address
                </Typography>
              </Localized>
              <Localized id="profile-changeEmail-desc">
                <Typography>
                  Change the email address used for signing in and for receiving
                  communication about your account.
                </Typography>
              </Localized>
            </div>
            <div>
              <Localized id="profile-changeEmail-current">
                <Typography variant="bodyCopyBold">Current email</Typography>
              </Localized>
              <Typography
                variant="heading2"
                color="textDark"
                className={CLASSES.myEmail.form.currentEmail}
              >
                {viewer.email}
              </Typography>
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
                              />
                              <FieldValidationMessage meta={meta} />
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
                                  id={input.name}
                                  placeholder="Password"
                                  color={colorFromMeta(meta)}
                                  disabled={submitting}
                                  fullWidth
                                  {...input}
                                />
                              </Localized>
                              <FieldValidationMessage meta={meta} fullWidth />
                            </FormField>
                          )}
                        </Field>
                      </HorizontalGutter>
                    </FormField>
                    {submitError && (
                      <CallOut
                        className={CLASSES.myEmail.form.errorMessage}
                        color="error"
                        fullWidth
                      >
                        {submitError}
                      </CallOut>
                    )}
                  </HorizontalGutter>
                  <Flex justifyContent="flex-end" className={styles.footer}>
                    <Localized id="profile-changeEmail-cancel">
                      <Button
                        className={CLASSES.myEmail.form.cancelButton}
                        type="button"
                        onClick={toggleEditForm}
                      >
                        Cancel
                      </Button>
                    </Localized>
                    <Localized id="profile-changeEmail-submit">
                      <Button
                        className={CLASSES.myEmail.form.saveButton}
                        variant={
                          preventSubmit(formProps) ? "outlined" : "filled"
                        }
                        type="submit"
                        color={preventSubmit(formProps) ? "regular" : "primary"}
                        disabled={preventSubmit(formProps)}
                      >
                        <ButtonIcon>save</ButtonIcon>
                        <span>Save</span>
                      </Button>
                    </Localized>
                  </Flex>
                </form>
              )}
            </Form>
          </HorizontalGutter>
        </CallOut>
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
})(changeEmailContainer);

export default enhanced;
