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
  InputDescription,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import AutoHeightContainer from "../containers/AutoHeightContainer";
import * as styles from "./SignUp.css";

interface FormProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpForm {
  onSubmit: OnSubmit<FormProps>;
  goToSignIn: () => void;
}

const SignUp: StatelessComponent<SignUpForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <AutoHeightContainer />
          <Flex itemGutter="double" direction="column" className={styles.root}>
            <Flex direction="column">
              <Typography variant="heading1" align="center">
                Sign up to join the conversation
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
                name="username"
                validate={composeValidators(required, validateUsername)}
              >
                {({ input, meta }) => (
                  <FormField>
                    <InputLabel>Username</InputLabel>
                    <InputDescription>
                      A unique identifier displayed on your comments. You may
                      use “_” and “.”
                    </InputDescription>
                    <TextField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      placeholder="Username"
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
                    <InputDescription>
                      Must be at least 8 characters
                    </InputDescription>
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
                  </FormField>
                )}
              </Field>

              <Field
                name="confirmPassword"
                validate={composeValidators(
                  required,
                  validatePassword,
                  validateEqualPasswords
                )}
              >
                {({ input, meta }) => (
                  <FormField>
                    <InputLabel>Confirm Password</InputLabel>
                    <InputDescription>
                      Must be at least 8 characters
                    </InputDescription>
                    <TextField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      placeholder="Confirm Password"
                      type="password"
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
            </Flex>
            <div>
              <Button
                variant="filled"
                color="primary"
                size="large"
                fullWidth
                type="submit"
              >
                Sign up and join the conversation
              </Button>
              <Flex itemGutter="half" justifyContent="center">
                <Typography>Already have an account?</Typography>
                <Button
                  variant="underlined"
                  size="small"
                  color="primary"
                  onClick={props.goToSignIn}
                >
                  Sign In
                </Button>
              </Flex>
            </div>
          </Flex>
        </form>
      )}
    </Form>
  );
};

export default SignUp;
