import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";

import {
  composeValidators,
  required,
  validateEmail,
  validatePassword,
} from "talk-framework/lib/validation";

import {
  Button,
  CallOut,
  Flex,
  FormField,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import AutoHeightContainer from "../containers/AutoHeightContainer";
import * as styles from "./SignIn.css";

interface FormProps {
  email: string;
  password: string;
}

export interface SignInForm {
  onSubmit: OnSubmit<FormProps>;
  goToSignUp: () => void;
  goToForgotPassword: () => void;
}

const SignIn: StatelessComponent<SignInForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <AutoHeightContainer />
          <Flex itemGutter="double" direction="column" className={styles.root}>
            <Typography variant="heading1" align="center">
              Sign in to join the conversation
            </Typography>

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
                  <InputLabel>Email Address</InputLabel>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    placeholder="Email Address"
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage>
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
                  <InputLabel>Password</InputLabel>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    placeholder="Password"
                    type="password"
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                  <span className={styles.forgotPassword}>
                    <Button
                      variant="underlined"
                      color="primary"
                      size="small"
                      onClick={props.goToForgotPassword}
                    >
                      Forgot your password?
                    </Button>
                  </span>
                </FormField>
              )}
            </Field>

            <div>
              <Button
                variant="filled"
                color="primary"
                size="large"
                fullWidth
                type="submit"
              >
                Sign in and join the conversation
              </Button>
              <Flex itemGutter="half" justifyContent="center">
                <Typography>Don't have an account?</Typography>
                <Button
                  variant="underlined"
                  size="small"
                  color="primary"
                  onClick={props.goToSignUp}
                >
                  Sign Up
                </Button>
              </Flex>
            </div>
          </Flex>
        </form>
      )}
    </Form>
  );
};

export default SignIn;
