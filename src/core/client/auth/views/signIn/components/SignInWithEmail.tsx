import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";

import EmailField from "talk-auth/components/EmailField";
import AutoHeightContainer from "talk-auth/containers/AutoHeightContainer";
import { PasswordField } from "talk-framework/components";
import { composeValidators, required } from "talk-framework/lib/validation";
import {
  Button,
  ButtonIcon,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  ValidationMessage,
} from "talk-ui/components";

interface FormProps {
  email: string;
  password: string;
}

export interface SignInWithEmailForm {
  onSubmit: OnSubmit<FormProps>;
  onGotoForgotPassword: () => void;
}

const SignInWithEmail: StatelessComponent<SignInWithEmailForm> = props => {
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

            <EmailField disabled={submitting} />
            <Field name="password" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormField>
                  <Localized id="signIn-passwordLabel">
                    <InputLabel htmlFor={input.name}>Password</InputLabel>
                  </Localized>
                  <Localized
                    id="signIn-passwordTextField"
                    attrs={{ placeholder: true }}
                  >
                    <PasswordField
                      id={input.name}
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
                  {meta.touched && (meta.error || meta.submitError) && (
                    <ValidationMessage fullWidth>
                      {meta.error || meta.submitError}
                    </ValidationMessage>
                  )}
                  <Flex justifyContent="flex-end">
                    <Localized id="signIn-forgotYourPassword">
                      <Button
                        data-testid="gotoForgotPasswordButton"
                        variant="underlined"
                        color="primary"
                        size="small"
                        disabled={submitting}
                        onClick={props.onGotoForgotPassword}
                      >
                        Forgot your password?
                      </Button>
                    </Localized>
                  </Flex>
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
              <Localized id="signIn-signInWithEmail">
                <span>Sign in with Email</span>
              </Localized>
            </Button>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default SignInWithEmail;
