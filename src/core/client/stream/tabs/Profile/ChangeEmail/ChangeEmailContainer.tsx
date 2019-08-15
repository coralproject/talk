import { FORM_ERROR, FormApi, FormState } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form } from "react-final-form";
import { Environment } from "relay-runtime";

import { PasswordField } from "coral-framework/components";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
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

import { ChangeEmailContainer_viewer as ViewerData } from "coral-stream/__generated__/ChangeEmailContainer_viewer.graphql";

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
}

interface FormProps {
  email: string;
  password: string;
}

const changeEmailContainer: FunctionComponent<Props> = ({ viewer }) => {
  const updateEmail = useMutation(UpdateEmailMutation);

  const [showEditForm, setShowEditForm] = useState(false);
  const [emailUpdated, setEmailUpdated] = useState(false);
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
      setEmailUpdated(true);

      return;
    },
    [updateEmail]
  );

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
    <HorizontalGutter spacing={5} data-testid="profile-changeEmail">
      {!showEditForm && (
        <Flex alignItems="center">
          <Typography>{viewer.email}</Typography>{" "}
          {!viewer.emailVerified && (
            <Localized id="profile-changeEmail-unverified">
              <Typography color="textSecondary">(Unverified)</Typography>
            </Localized>
          )}
          <Localized id="profile-changeEmail-edit">
            <Button size="small" color="primary" onClick={toggleEditForm}>
              Edit
            </Button>
          </Localized>
        </Flex>
      )}
      {!viewer.emailVerified && emailUpdated && !showEditForm && (
        <CallOut>
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
                  className={styles.resendButton}
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
        <CallOut fullWidth color="primary">
          <Localized id="profile-changeEmail-resent">
            <Typography>Your confirmation email has been re-sent.</Typography>
          </Localized>
        </CallOut>
      )}
      {showEditForm && (
        <CallOut className={styles.callOut} color="primary">
          <HorizontalGutter spacing={4}>
            <div>
              <Localized id="profile-changeEmail-heading">
                <Typography variant="heading2" gutterBottom>
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
                <Typography
                  className={styles.currentEmail}
                  variant="bodyCopyBold"
                >
                  Current email
                </Typography>
              </Localized>
              <Typography variant="heading2">{viewer.email}</Typography>
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
                              <ValidationMessage meta={meta} />
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
                              <ValidationMessage meta={meta} fullWidth />
                            </FormField>
                          )}
                        </Field>
                      </HorizontalGutter>
                    </FormField>
                    {submitError && (
                      <CallOut color="error" fullWidth>
                        {submitError}
                      </CallOut>
                    )}
                  </HorizontalGutter>
                  <Flex justifyContent="flex-end" className={styles.footer}>
                    <Localized id="profile-changeEmail-cancel">
                      <Button type="button" onClick={toggleEditForm}>
                        Cancel
                      </Button>
                    </Localized>
                    <Localized id="profile-changeEmail-submit">
                      <Button
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
    }
  `,
})(changeEmailContainer);

export default enhanced;
