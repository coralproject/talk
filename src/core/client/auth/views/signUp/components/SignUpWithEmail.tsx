import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { PasswordField } from "talk-framework/components";
import { OnSubmit } from "talk-framework/lib/form";
import {
  composeValidators,
  required,
  validateEmail,
  validatePassword,
  validateUsername,
} from "talk-framework/lib/validation";
import {
  Button,
  ButtonIcon,
  CallOut,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  ValidationMessage,
} from "talk-ui/components";

import AutoHeightContainer from "talk-auth/containers/AutoHeightContainer";

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
              name="email"
              validate={composeValidators(required, validateEmail)}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="signUp-emailAddressLabel">
                    <InputLabel>Email Address</InputLabel>
                  </Localized>
                  <Localized
                    id="signUp-emailAddressTextField"
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
            <Field
              name="username"
              validate={composeValidators(required, validateUsername)}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="signUp-usernameLabel">
                    <InputLabel>Username</InputLabel>
                  </Localized>
                  <Localized id="signUp-usernameDescription">
                    <InputDescription>You may use “_” and “.”</InputDescription>
                  </Localized>
                  <Localized
                    id="signUp-usernameTextField"
                    attrs={{ placeholder: true }}
                  >
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
            <Field
              name="password"
              validate={composeValidators(required, validatePassword)}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="signUp-passwordLabel">
                    <InputLabel>Password</InputLabel>
                  </Localized>
                  <Localized id="signUp-passwordDescription" $minLength={8}>
                    <InputDescription>
                      {"Must be at least {$minLength} characters"}
                    </InputDescription>
                  </Localized>
                  <Localized
                    id="signUp-passwordTextField"
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
            <Button
              variant="filled"
              color="brand"
              size="large"
              type="submit"
              disabled={submitting}
              fullWidth
            >
              <ButtonIcon size="md">email</ButtonIcon>
              <Localized id="signUp-signUpWithEmail">
                <span>Sign up with Email</span>
              </Localized>
            </Button>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default SignUp;
