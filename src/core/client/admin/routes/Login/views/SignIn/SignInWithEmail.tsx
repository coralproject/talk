import { Localized } from "fluent-react/compat";
import { Link } from "found";
import React, { FunctionComponent } from "react";
import { Field, Form } from "react-final-form";

import { PasswordField } from "coral-framework/components";
import {
  colorFromMeta,
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
  Typography,
} from "coral-ui/components";

import EmailField from "../../EmailField";

import styles from "./SignInWithEmail.css";

interface FormProps {
  email: string;
  password: string;
}

export interface SignInWithEmailForm {
  onSubmit: OnSubmit<FormProps>;
}

const SignInWithEmail: FunctionComponent<SignInWithEmailForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <HorizontalGutter size="full">
            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}

            <EmailField disabled={submitting} />
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
                      id={input.name}
                      placeholder="Password"
                      color={colorFromMeta(meta)}
                      disabled={submitting}
                      fullWidth
                      {...input}
                    />
                  </Localized>
                  <ValidationMessage meta={meta} fullWidth />
                  <Flex justifyContent="flex-end">
                    <Typography>
                      <Localized id="login-signIn-forgot-password">
                        <Link
                          className={styles.textLink}
                          to="/admin/forgot-password"
                        >
                          Forgot your password?
                        </Link>
                      </Localized>
                    </Typography>
                  </Flex>
                </FormField>
              )}
            </Field>
            <Button
              variant="filled"
              color="brand"
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
