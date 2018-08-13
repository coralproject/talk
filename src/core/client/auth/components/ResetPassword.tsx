import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";

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
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import * as styles from "./ResetPassword.css";

const ResetPassword: StatelessComponent = props => {
  return (
    // TODO (bc) add functionality when Reset Password is done on the backend
    // tslint:disable-next-line:no-empty
    <Form onSubmit={() => {}}>
      {({ handleSubmit, submitting }) => (
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
                  <Typography variant="inputDescription">
                    Must be at least 8 characters
                  </Typography>
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
                  <Typography variant="inputDescription">
                    Must be at least 8 characters
                  </Typography>
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
