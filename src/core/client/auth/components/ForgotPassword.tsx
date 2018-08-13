import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";

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

import * as styles from "./ForgotPassword.css";

const ForgotPassword: StatelessComponent = props => {
  return (
    // TODO (bc) add functionality when Forgot Password is done on the backend
    // tslint:disable-next-line:no-empty
    <Form onSubmit={() => {}}>
      {({ handleSubmit, submitting }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Flex itemGutter direction="column" className={styles.root}>
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
            <div className={styles.footer}>
              <Button variant="filled" color="primary" size="large" fullWidth>
                Send Email
              </Button>
            </div>
          </Flex>
        </form>
      )}
    </Form>
  );
};

export default ForgotPassword;
