import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";

import {
  composeValidators,
  required,
  validateEmail,
} from "talk-framework/lib/validation";

import AutoHeightContainer from "talk-auth/containers/AutoHeightContainer";
import { PasswordField } from "talk-framework/components";
import {
  Button,
  ButtonIcon,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  ValidationMessage,
} from "talk-ui/components";

interface FormProps {
  email: string;
  password: string;
}

export interface SignInWithEmailForm {
  onSubmit: OnSubmit<FormProps>;
  onGotoForgotPassword: () => void;
}

const SignInWithEmail: StatelessComponent<SignInWithEmailForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <AutoHeightContainer />
          <HorizontalGutter size="full">
            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}

            <Field
              name="email"
              validate={composeValidators(required, validateEmail)}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="signIn-emailAddressLabel">
                    <InputLabel>Email Address</InputLabel>
                  </Localized>
                  <Localized
                    id="signIn-emailAddressTextField"
                    attrs={{ placeholder: true }}
                  >
                    <TextField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      placeholder="Email Address"
                      color={
                        meta.touched && (meta.error || meta.submitError)
                          ? "error"
                          : "regular"
                      }
                      disabled={submitting}
                      fullWidth
                    />
                  </Localized>
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </FormField>
              )}
            </Field>

            <Field name="password" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormField>
                  <Localized id="signIn-passwordLabel">
                    <InputLabel>Password</InputLabel>
                  </Localized>
                  <Localized
                    id="signIn-passwordTextField"
                    attrs={{ placeholder: true }}
                  >
                    <PasswordField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      placeholder="Password"
                      color={
                        meta.touched && (meta.error || meta.submitError)
                          ? "error"
                          : "regular"
                      }
                      disabled={submitting}
                      fullWidth
                    />
                  </Localized>
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                  <Flex justifyContent="flex-end">
                    <Localized id="signIn-forgotYourPassword">
                      <Button
                        id="signIn-gotoForgotPasswordButton"
                        variant="underlined"
                        color="primary"
                        size="small"
                        disabled={submitting}
                        onClick={props.onGotoForgotPassword}
                      >
                        Forgot your password?
                      </Button>
                    </Localized>
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
              <Localized id="signIn-signInWithEmail">
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
