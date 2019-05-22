import { OnSubmit } from "coral-framework/lib/form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field, Form } from "react-final-form";

import EmailField from "coral-auth/components/EmailField";
import AutoHeightContainer from "coral-auth/containers/AutoHeightContainer";
import { PasswordField } from "coral-framework/components";
import { composeValidators, required } from "coral-framework/lib/validation";
import {
  Button,
  ButtonIcon,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  TextLink,
  Typography,
  ValidationMessage,
} from "coral-ui/components";

interface FormProps {
  email: string;
  password: string;
}

export interface SignInWithEmailForm {
  onSubmit: OnSubmit<FormProps>;
  onGotoForgotPassword: React.EventHandler<React.MouseEvent>;
  forgotPasswordHref: string;
}

const SignInWithEmail: FunctionComponent<SignInWithEmailForm> = props => {
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
                    <Typography variant="bodyCopy">
                      <Localized id="signIn-forgotYourPassword">
                        <TextLink
                          onClick={props.onGotoForgotPassword}
                          href={props.forgotPasswordHref}
                        >
                          Forgot your password?
                        </TextLink>
                      </Localized>
                    </Typography>
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
