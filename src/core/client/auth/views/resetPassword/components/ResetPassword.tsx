import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";

import { Bar, Title } from "talk-auth/components//Header";
import Main from "talk-auth/components/Main";
import AutoHeightContainer from "talk-auth/containers/AutoHeightContainer";
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
    <div>
      <Bar>
        <Localized id="resetPassword-resetPasswordHeader">
          <Title>Reset Password</Title>
        </Localized>
      </Bar>
      <Main>
        <Form onSubmit={props.onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <AutoHeightContainer />
              <HorizontalGutter size="full">
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
                          color={
                            meta.touched && (meta.error || meta.submitError)
                              ? "error"
                              : "regular"
                          }
                          disabled={submitting}
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
                          color={
                            meta.touched && (meta.error || meta.submitError)
                              ? "error"
                              : "regular"
                          }
                          disabled={submitting}
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
                  <Button
                    variant="filled"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={submitting}
                  >
                    Reset Password
                  </Button>
                </Localized>
              </HorizontalGutter>
            </form>
          )}
        </Form>
      </Main>
    </div>
  );
};

export default ResetPassword;
