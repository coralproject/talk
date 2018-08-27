import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";

import {
  composeValidators,
  required,
  validateEmail,
} from "talk-framework/lib/validation";

import {
  Button,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import AutoHeightContainer from "../containers/AutoHeightContainer";

interface FormProps {
  email: string;
  password: string;
}

export interface SignInForm {
  onSubmit: OnSubmit<FormProps>;
  onGotoSignUp: () => void;
  onGotoForgotPassword: () => void;
}

const SignIn: StatelessComponent<SignInForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <AutoHeightContainer />
          <HorizontalGutter size="double">
            <Localized id="signIn-signInToJoinHeader">
              <Typography variant="heading1" align="center">
                Sign in to join the conversation
              </Typography>
            </Localized>

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
                    id="signIn-emailAddressTextfield"
                    attrs={{ placeholder: true }}
                  >
                    <TextField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      placeholder="Email Address"
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
                    id="signIn-passwordTextfield"
                    attrs={{ placeholder: true }}
                  >
                    <TextField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      placeholder="Password"
                      type="password"
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
                        variant="underlined"
                        color="primary"
                        size="small"
                        onClick={props.onGotoForgotPassword}
                      >
                        Forgot your password?
                      </Button>
                    </Localized>
                  </Flex>
                </FormField>
              )}
            </Field>
            <Localized id="signIn-signInAndJoinButton">
              <Button
                variant="filled"
                color="primary"
                size="large"
                type="submit"
                fullWidth
              >
                Sign in and join the conversation
              </Button>
            </Localized>
            <Flex justifyContent="center">
              <Localized
                id="signIn-noAccountSignUp"
                button={
                  <Button
                    variant="underlined"
                    size="small"
                    color="primary"
                    onClick={props.onGotoSignUp}
                  />
                }
              >
                <Typography variant="bodyCopy" container={Flex}>
                  {"Don't have an account? <button>Sign Up</button>"}
                </Typography>
              </Localized>
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default SignIn;
