import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";

import {
  composeValidators,
  required,
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

import AutoHeightContainer from "../containers/AutoHeightContainer";

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
      {({ handleSubmit, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <AutoHeightContainer />
          <HorizontalGutter size="double">
            <Localized id="resetPassword-resetPasswordHeader">
              <Typography variant="heading1" align="center">
                Reset Password
              </Typography>
            </Localized>
            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}
            <Field
              name="password"
              validate={composeValidators(required, validatePassword)}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="resetPassword-passwordLabel">
                    <InputLabel>Password</InputLabel>
                  </Localized>
                  <Localized
                    id="resetPassword-passwordDescription"
                    $minLength={8}
                  >
                    <InputDescription>
                      {"Must be at least {$minLength} characters"}
                    </InputDescription>
                  </Localized>
                  <Localized
                    id="resetPassword-passwordTextField"
                    attrs={{ placeholder: true }}
                  >
                    <TextField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      placeholder="Password"
                      type="password"
                      fullWidth
                    />
                  </Localized>
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
              validate={composeValidators(required, validateEqualPasswords)}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="resetPassword-confirmPasswordLabel">
                    <InputLabel>Confirm Password</InputLabel>
                  </Localized>
                  <Localized
                    id="resetPassword-confirmPasswordTextField"
                    attrs={{ placeholder: true }}
                  >
                    <TextField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      placeholder="Confirm Password"
                      type="password"
                      fullWidth
                    />
                  </Localized>
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </FormField>
              )}
            </Field>
            <Localized id="resetPassword-resetPasswordButton">
              <Button variant="filled" color="primary" size="large" fullWidth>
                Reset Password
              </Button>
            </Localized>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default ResetPassword;
