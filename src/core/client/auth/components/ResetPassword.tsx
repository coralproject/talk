import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";
import * as styles from "./SignIn.css";

import {
  composeValidators,
  required,
  validateEqualPasswords,
  validatePassword,
} from "talk-framework/lib/validation";

import {
  Button,
  Flex,
  FormField,
  InputDescription,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

interface FormProps {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordForm {
  onSubmit: OnSubmit<FormProps>;
}

const ResetPassword: StatelessComponent<ResetPasswordForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Flex itemGutter direction="column" className={styles.root}>
            <Typography variant="heading1" align="center">
              Reset Password
            </Typography>
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
            <div className={styles.footer}>
              <Button variant="filled" color="primary" size="large" fullWidth>
                Reset Password
              </Button>
            </div>
          </Flex>
        </form>
      )}
    </Form>
  );
};

export default ResetPassword;
