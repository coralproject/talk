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
import { View } from "../containers/SignInContainer";
import * as styles from "./SignIn.css";

interface FormProps {
  email: string;
  password: string;
}

export interface SignInForm {
  onSubmit: OnSubmit<FormProps>;
  setView: (view: View) => void;
  error: string | null;
}

const SignIn: StatelessComponent<SignInForm> = props => {
  console.log(props);
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Flex itemGutter direction="column" className={styles.root}>
            <Typography variant="heading1" align="center">
              Sign in to join the conversation
            </Typography>
            {props.error && (
              <CallOut color="error" fullWidth>
                {props.error}
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
                      onClick={() => {
                        props.setView("FORGOT_PASSWORD");
                      }}
                    >
                      Forgot your password?
                    </Button>
                  </span>
                </FormField>
              )}
            </Field>

            <div className={styles.footer}>
              <Button
                variant="filled"
                color="primary"
                size="large"
                fullWidth
                type="submit"
              >
                Sign in and join the conversation
              </Button>
              <Flex
                itemGutter="half"
                justifyContent="center"
                className={styles.subFooter}
              >
                <Typography>Don't have an account?</Typography>
                <Button
                  variant="underlined"
                  size="small"
                  color="primary"
                  onClick={() => {
                    props.setView("SIGN_UP");
                  }}
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
