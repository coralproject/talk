import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import Main from "coral-auth/components/Main";
import { getViewURL } from "coral-auth/helpers";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { SetViewMutation } from "coral-auth/mutations";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { streamColorFromMeta } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validateEmail,
} from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import {
  Flex,
  FormField,
  Icon,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";
import { Button, CallOut, ValidationMessage } from "coral-ui/components/v3";

import ForgotPasswordMutation from "./ForgotPasswordMutation";

import styles from "./ForgotPasswordForm.css";

interface FormProps {
  email: string;
}

interface Props {
  email: string | null;
  onCheckEmail: (email: string) => void;
}

const ForgotPasswordForm: FunctionComponent<Props> = ({
  email,
  onCheckEmail,
}) => {
  const { window } = useCoralContext();
  const ref = useResizePopup();
  const signInHref = getViewURL("SIGN_IN", window);
  const forgotPassword = useMutation(ForgotPasswordMutation);
  const setView = useMutation(SetViewMutation);
  const onSubmit = useCallback(
    async (form: FormProps) => {
      try {
        await forgotPassword(form);
        onCheckEmail(form.email);
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          return error.invalidArgs;
        }
        return { [FORM_ERROR]: error.message };
      }
      return;
    },
    [forgotPassword, onCheckEmail]
  );
  const onGotoSignIn = useCallback(
    (e: React.MouseEvent) => {
      setView({ view: "SIGN_IN", history: "push" });
      if (e.preventDefault) {
        e.preventDefault();
      }
    },
    [setView]
  );

  return (
    <div ref={ref} data-testid="forgotPassword-container">
      <div role="banner" className={cn(CLASSES.login.bar, styles.bar)}>
        <Localized id="forgotPassword-forgotPasswordHeader">
          <div className={cn(CLASSES.login.title, styles.title)}>
            Forgot password?
          </div>
        </Localized>
      </div>
      {/* If an email address has been provided, then they are already logged in. */}
      {!email && (
        <div role="region" className={cn(CLASSES.login.subBar, styles.subBar)}>
          <Flex alignItems="center" justifyContent="center">
            <Button
              color="primary"
              variant="flat"
              fontFamily="primary"
              fontWeight="semiBold"
              fontSize="small"
              paddingSize="none"
              underline
              href={signInHref}
              onClick={onGotoSignIn}
            >
              <Localized id="forgotPassword-gotBackToSignIn">
                Go back to sign in page
              </Localized>
            </Button>
          </Flex>
        </div>
      )}
      <Main id="forgot-password-main" data-testid="forgotPassword-main">
        <Form onSubmit={onSubmit} initialValues={{ email: email ? email : "" }}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <Localized id="forgotPassword-enterEmailAndGetALink">
                <div className={styles.description}>
                  Enter your email address below and we will send you a link to
                  reset your password.
                </div>
              </Localized>
              {submitError && (
                <div className={cn(CLASSES.login.errorContainer, styles.error)}>
                  <CallOut
                    className={CLASSES.login.error}
                    color="error"
                    icon={<Icon size="sm">error</Icon>}
                    title={submitError}
                  />
                </div>
              )}
              <div className={cn(CLASSES.login.field, styles.field)}>
                <Field
                  name="email"
                  validate={composeValidators(required, validateEmail)}
                >
                  {({ input, meta }) => (
                    <FormField>
                      <Localized id="forgotPassword-emailAddressLabel">
                        <InputLabel htmlFor={input.name}>
                          Email Address
                        </InputLabel>
                      </Localized>
                      <Localized
                        id="forgotPassword-emailAddressTextField"
                        attrs={{ placeholder: true }}
                      >
                        <TextField
                          {...input}
                          id={input.name}
                          placeholder="Email Address"
                          color={streamColorFromMeta(meta)}
                          disabled={submitting}
                          fullWidth
                        />
                      </Localized>
                      <ValidationMessage meta={meta} />
                    </FormField>
                  )}
                </Field>
              </div>
              <div className={styles.actions}>
                <Localized id="forgotPassword-sendEmailButton">
                  <Button
                    variant="filled"
                    color="primary"
                    fontSize="medium"
                    paddingSize="medium"
                    upperCase
                    fullWidth
                    type="submit"
                    disabled={submitting}
                  >
                    Send email
                  </Button>
                </Localized>
              </div>
            </form>
          )}
        </Form>
      </Main>
    </div>
  );
};

export default ForgotPasswordForm;
