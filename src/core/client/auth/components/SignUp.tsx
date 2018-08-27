import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";
import {
  composeValidators,
  required,
  validateEmail,
  validateEqualPasswords,
  validatePassword,
  validateUsername,
} from "talk-framework/lib/validation";
import {
  Button,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import AutoHeightContainer from "../containers/AutoHeightContainer";

interface FormProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpForm {
  onSubmit: OnSubmit<FormProps>;
  onGotoSignIn: () => void;
}

const SignUp: StatelessComponent<SignUpForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <AutoHeightContainer />
          <HorizontalGutter size="double">
            <Localized id="signUp-signUpToJoinHeader">
              <Typography variant="heading1" align="center">
                Sign up to join the conversation
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
                  <Localized id="signUp-emailAddressLabel">
                    <InputLabel>Email Address</InputLabel>
                  </Localized>
                  <Localized
                    id="signUp-emailAddressTextField"
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
            <Field
              name="username"
              validate={composeValidators(required, validateUsername)}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="signUp-usernameLabel">
                    <InputLabel>Username</InputLabel>
                  </Localized>
                  <Localized id="signUp-usernameDescription">
                    <InputDescription>
                      A unique identifier displayed on your comments. You may
                      use “_” and “.”
                    </InputDescription>
                  </Localized>
                  <Localized
                    id="signUp-usernameTextField"
                    attrs={{ placeholder: true }}
                  >
                    <TextField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      placeholder="Username"
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
            <Field
              name="password"
              validate={composeValidators(required, validatePassword)}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="signUp-passwordLabel">
                    <InputLabel>Password</InputLabel>
                  </Localized>
                  <Localized id="signUp-passwordDescription" $minLength={8}>
                    <InputDescription>
                      {"Must be at least {$minLength} characters"}
                    </InputDescription>
                  </Localized>
                  <Localized
                    id="signUp-passwordTextField"
                    attrs={{ placeholder: true }}
                  >
                    <TextField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      placeholder="Password"
                      type="password"
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
            <Field
              name="confirmPassword"
              validate={composeValidators(required, validateEqualPasswords)}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="signUp-confirmPasswordLabel">
                    <InputLabel>Confirm Password</InputLabel>
                  </Localized>
                  <Localized
                    id="signUp-confirmPasswordTextField"
                    attrs={{ placeholder: true }}
                  >
                    <TextField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      placeholder="Confirm Password"
                      type="password"
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
            <Localized id="signUp-signUpAndJoinButton">
              <Button
                variant="filled"
                color="primary"
                size="large"
                type="submit"
                disabled={submitting}
                fullWidth
              >
                Sign up and join the conversation
              </Button>
            </Localized>
            <Flex justifyContent="center">
              <Localized
                id="signUp-accountAvailableSignIn"
                button={
                  <Button
                    variant="underlined"
                    size="small"
                    color="primary"
                    onClick={props.onGotoSignIn}
                    disabled={submitting}
                  />
                }
              >
                <Typography variant="bodyCopy" container={Flex}>
                  {"Already have an account? <button>Sign In </button>"}
                </Typography>
              </Localized>
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default SignUp;
