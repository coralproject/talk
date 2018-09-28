import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";
import {
  composeValidators,
  required,
  validateEmail,
  validateEqualPasswords,
  validatePassword,
} from "talk-framework/lib/validation";
import {
  Button,
  CallOut,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

interface FormProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface CreateYourAccountForm {
  onSubmit: OnSubmit<FormProps>;
}

const CreateYourAccount: StatelessComponent<CreateYourAccountForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <HorizontalGutter size="double">
            <Typography variant="heading1" align="center">
              Create Your Account
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
                  <InputLabel>Email</InputLabel>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    placeholder="Email"
                    color={
                      meta.touched && (meta.error || meta.submitError)
                        ? "error"
                        : "regular"
                    }
                    disabled={submitting}
                    fullWidth
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </FormField>
              )}
            </Field>

            <Field name="username" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormField>
                  <InputLabel>Username</InputLabel>
                  <InputDescription>
                    A unique identifier displayed on your comments. You may use
                    “_” and “.”
                  </InputDescription>
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
                    color={
                      meta.touched && (meta.error || meta.submitError)
                        ? "error"
                        : "regular"
                    }
                    disabled={submitting}
                    fullWidth
                  />
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
                  <InputLabel>Confirm Password</InputLabel>
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
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </FormField>
              )}
            </Field>

            <Button
              variant="filled"
              color="primary"
              size="large"
              type="submit"
              disabled={submitting}
              fullWidth
            >
              Save
            </Button>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default CreateYourAccount;
