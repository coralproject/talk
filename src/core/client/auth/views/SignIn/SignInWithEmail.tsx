import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field, Form } from "react-final-form";

import EmailField from "coral-auth/components/EmailField";
import { colorFromMeta, FormError, OnSubmit } from "coral-framework/lib/form";
import { composeValidators, required } from "coral-framework/lib/validation";
import {
  Flex,
  FormField,
  Icon,
  InputLabel,
  PasswordField,
} from "coral-ui/components/v2";
import { Button, CallOut, ValidationMessage } from "coral-ui/components/v3";

import styles from "./SignInWithEmail.css";

interface FormProps {
  email: string;
  password: string;
}

interface FormErrorProps extends FormProps, FormError {}

export interface SignInWithEmailForm {
  onSubmit: OnSubmit<FormErrorProps>;
  onGotoForgotPassword: React.EventHandler<React.MouseEvent>;
  forgotPasswordHref: string;
}

const SignInWithEmail: FunctionComponent<SignInWithEmailForm> = (props) => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          {submitError && <CallOut color="negative" title={submitError} />}

          <div className={styles.field}>
            <EmailField disabled={submitting} />
          </div>
          <div className={styles.field}>
            <Field name="password" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormField>
                  <Localized id="signIn-passwordLabel">
                    <InputLabel htmlFor={input.name}>Password</InputLabel>
                  </Localized>
                  <Localized
                    id="signIn-passwordTextField"
                    attrs={{ placeholder: true }}
                  >
                    <PasswordField
                      {...input}
                      id={input.name}
                      placeholder="Password"
                      color={colorFromMeta(meta)}
                      disabled={submitting}
                      fullWidth
                    />
                  </Localized>
                  <ValidationMessage meta={meta} />
                  <Flex justifyContent="flex-end">
                    <div className={styles.forgotPassword}>
                      <Button
                        variant="flat"
                        color="primary"
                        textSize="none"
                        fontWeight="semiBold"
                        marginSize="none"
                        onClick={props.onGotoForgotPassword}
                        href={props.forgotPasswordHref}
                        underline
                      >
                        <Localized id="signIn-forgotYourPassword">
                          Forgot your password?
                        </Localized>
                      </Button>
                    </div>
                  </Flex>
                </FormField>
              )}
            </Field>
          </div>
          <div className={styles.actions}>
            <Button
              variant="filled"
              color="primary"
              textSize="small"
              marginSize="small"
              type="submit"
              disabled={submitting}
              fullWidth
              upperCase
            >
              <Flex alignItems="center" justifyContent="center">
                <Icon size="md" className={styles.icon}>
                  email
                </Icon>
                <Localized id="signIn-signInWithEmail">
                  <span>Sign in with Email</span>
                </Localized>
              </Flex>
            </Button>
          </div>
        </form>
      )}
    </Form>
  );
};

export default SignInWithEmail;
