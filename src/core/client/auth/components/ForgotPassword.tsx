import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";
import * as styles from "./SignIn.css";

import {
  composeValidators,
  required,
  validateEmail,
} from "talk-framework/lib/validation";

import {
  Button,
  Flex,
  FormField,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

interface FormProps {
  email: string;
}

export interface ForgotPasswordForm {
  onSubmit: OnSubmit<FormProps>;
}

const ForgotPassword: StatelessComponent<ForgotPasswordForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Flex itemGutter="double" direction="column" className={styles.root}>
            <Typography variant="heading1" align="center">
              Forgot Password
            </Typography>
            <Typography variant="bodyCopy">
              Enter your email address below and we will send you a link to
              reset your password.
            </Typography>
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
            <Button variant="filled" color="primary" size="large" fullWidth>
              Send Email
            </Button>
          </Flex>
        </form>
      )}
    </Form>
  );
};

export default ForgotPassword;
