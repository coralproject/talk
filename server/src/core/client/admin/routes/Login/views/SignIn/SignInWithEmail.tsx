import { Localized } from "@fluent/react/compat";
import { Link } from "found";
import React, { FunctionComponent } from "react";
import { Field, Form } from "react-final-form";

import { PasswordField } from "coral-framework/components";
import {
  colorFromMeta,
  FormError,
  OnSubmit,
  ValidationMessage,
} from "coral-framework/lib/form";
import { composeValidators, required } from "coral-framework/lib/validation";
import {
  Button,
  ButtonIcon,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
} from "coral-ui/components/v2";

import EmailField from "../../EmailField";

import styles from "./SignInWithEmail.css";

interface FormProps {
  email: string;
  password: string;
}

interface FormSubmitProps extends FormProps, FormError {}

export interface SignInWithEmailForm {
  onSubmit: OnSubmit<FormSubmitProps>;
}

const SignInWithEmail: FunctionComponent<SignInWithEmailForm> = (props) => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <HorizontalGutter size="full" className={styles.container}>
            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}
            <div className={styles.field}>
              <EmailField disabled={submitting} />
            </div>
            <div className={styles.field}>
              <Field name="password" validate={composeValidators(required)}>
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="login-signIn-passwordLabel">
                      <InputLabel htmlFor={input.name}>Password</InputLabel>
                    </Localized>
                    <Localized
                      id="login-signIn-passwordTextField"
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
                    <ValidationMessage meta={meta} fullWidth />
                    <Flex justifyContent="flex-end">
                      <Localized id="login-signIn-forgot-password">
                        <Link
                          className={styles.textLink}
                          to="/admin/forgot-password"
                        >
                          Forgot your password?
                        </Link>
                      </Localized>
                    </Flex>
                  </FormField>
                )}
              </Field>
            </div>
            <Button
              variant="regular"
              color="regular"
              size="large"
              type="submit"
              disabled={submitting}
              fullWidth
            >
              <ButtonIcon size="md">email</ButtonIcon>
              <Localized id="login-signIn-signInWithEmail">
                <span>Sign in with Email</span>
              </Localized>
            </Button>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default SignInWithEmail;
