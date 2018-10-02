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
  Flex,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";
import { FormData } from "../../containers/AppContainer";

interface FormProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface CreateYourAccountForm {
  onSubmit: OnSubmit<FormProps>;
  handleGoToPreviousStep: () => void;
  data: Partial<FormData>;
}

const CreateYourAccount: StatelessComponent<CreateYourAccountForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <HorizontalGutter size="double">
            <Typography variant="heading1" align="center">
              Create an Administrator Account
            </Typography>
            <Typography>
              Error base on balls club stretch manager, dead ball era third
              baseman. Balk wrigley 4-bagger appeal line drive unearned run
              umpire. Forkball shortstop dead ball era hardball right field
              second baseman pinch hitter.
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

            <Flex direction="row" itemGutter>
              <Button
                onClick={props.handleGoToPreviousStep}
                variant="filled"
                color="regular"
                size="large"
                type="submit"
                disabled={submitting}
                fullWidth
              >
                Back
              </Button>

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
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default CreateYourAccount;
