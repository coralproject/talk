import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { Field, Form } from "react-final-form";

import EmailField from "coral-auth/components/EmailField";
import {
  FormError,
  OnSubmit,
  streamColorFromMeta,
} from "coral-framework/lib/form";
import { composeValidators, required } from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import {
  Flex,
  FormField,
  HorizontalGutter,
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
          <HorizontalGutter>
            {submitError && (
              <CallOut
                className={CLASSES.login.error}
                color="error"
                title={submitError}
              />
            )}
            <div className={cn(CLASSES.login.field, styles.field)}>
              <EmailField disabled={submitting} autofocus />
            </div>
            <div className={cn(CLASSES.login.field, styles.field)}>
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
                        color={streamColorFromMeta(meta)}
                        disabled={submitting}
                        fullWidth
                      />
                    </Localized>
                    <ValidationMessage meta={meta} />
                    <Flex justifyContent="flex-end">
                      <div
                        className={cn(
                          CLASSES.login.signInWithEmail.forgotPassword,
                          styles.forgotPassword
                        )}
                      >
                        <Button
                          variant="flat"
                          color="primary"
                          fontSize="none"
                          fontWeight="semiBold"
                          paddingSize="none"
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
                fontSize="small"
                paddingSize="small"
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
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default SignInWithEmail;
