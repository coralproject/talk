import * as React from "react";
import { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";
import { required } from "talk-framework/lib/validation";
import * as styles from "./SignUp.css";

import {
  Button,
  Flex,
  FormField,
  InputLabel,
  TextField,
  Typography,
} from "talk-ui/components";

interface FormProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpForm {
  onSubmit: OnSubmit<FormProps>;
}

const SignUp: StatelessComponent<SignUpForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Flex itemGutter direction="column" className={styles.root}>
            <Flex direction="column">
              <Typography variant="heading1" align="center">
                Sign up to join the conversation
              </Typography>

              <Field name="email" validate={required}>
                {({ input, meta }) => (
                  <FormField>
                    <InputLabel>Email Address</InputLabel>
                    <TextField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      placeholder="Email Address"
                    />
                  </FormField>
                )}
              </Field>

              <FormField>
                <InputLabel>Username</InputLabel>
                <Typography variant="inputDescription">
                  A unique identifier displayed on your comments. You may use
                  “_” and “.”
                </Typography>
                <TextField />
              </FormField>
              <FormField>
                <InputLabel>Password</InputLabel>
                <Typography variant="inputDescription">
                  Must be at least 8 characters
                </Typography>
                <TextField />
              </FormField>
              <FormField>
                <InputLabel>Confirm Password</InputLabel>
                <TextField />
              </FormField>
            </Flex>
            <div className={styles.footer}>
              <Button variant="filled" color="primary" size="large" fullWidth>
                Sign up and join the conversation
              </Button>
              <Flex
                itemGutter="half"
                justifyContent="center"
                className={styles.subFooter}
              >
                <Typography>Already have an account?</Typography>
                <Button variant="underlined" size="small" color="primary">
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
