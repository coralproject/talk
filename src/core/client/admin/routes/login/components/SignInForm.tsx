import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";

import { OnSubmit } from "talk-framework/lib/form";

import { PasswordField } from "talk-framework/components";
import {
  composeValidators,
  required,
  validateEmail,
} from "talk-framework/lib/validation";
import {
  Button,
  CallOut,
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  ValidationMessage,
} from "talk-ui/components";

interface FormProps {
  email: string;
  password: string;
}

interface Props {
  onSubmit: OnSubmit<FormProps>;
}

const SignIn: StatelessComponent<Props> = props => (
  <Form onSubmit={props.onSubmit}>
    {({ handleSubmit, submitting, submitError }) => (
      <form autoComplete="off" onSubmit={handleSubmit}>
        <HorizontalGutter size="double">
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
                <Localized id="login-signIn-emailAddressLabel">
                  <InputLabel>Email Address</InputLabel>
                </Localized>
                <Localized
                  id="login-signIn-emailAddressTextField"
                  attrs={{ placeholder: true }}
                >
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    placeholder="Email Address"
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
                    <ValidationMessage fullWidth>
                      {meta.error || meta.submitError}
                    </ValidationMessage>
                  )}
              </FormField>
            )}
          </Field>

          <Field name="password" validate={composeValidators(required)}>
            {({ input, meta }) => (
              <FormField>
                <Localized id="login-signIn-passwordLabel">
                  <InputLabel>Password</InputLabel>
                </Localized>
                <Localized
                  id="login-signIn-passwordTextField"
                  attrs={{ placeholder: true }}
                >
                  <PasswordField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    placeholder="Password"
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
                    <ValidationMessage fullWidth>
                      {meta.error || meta.submitError}
                    </ValidationMessage>
                  )}
              </FormField>
            )}
          </Field>
          <Localized id="login-signIn-signIn">
            <Button
              variant="filled"
              color="primary"
              size="large"
              type="submit"
              disabled={submitting}
              fullWidth
            >
              Sign in
            </Button>
          </Localized>
        </HorizontalGutter>
      </form>
    )}
  </Form>
);

export default SignIn;
