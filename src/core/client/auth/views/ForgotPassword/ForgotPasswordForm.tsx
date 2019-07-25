import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import AutoHeight from "coral-auth/components/AutoHeight";
import { Bar, SubBar, Title } from "coral-auth/components/Header";
import Main from "coral-auth/components/Main";
import { getViewURL } from "coral-auth/helpers";
import { SetViewMutation } from "coral-auth/mutations";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validateEmail,
} from "coral-framework/lib/validation";
import {
  Button,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  TextLink,
  Typography,
} from "coral-ui/components";

import ForgotPasswordMutation from "./ForgotPasswordMutation";

interface FormProps {
  email: string;
}

interface Props {
  onCheckEmail: (email: string) => void;
}

const ForgotPasswordForm: FunctionComponent<Props> = ({ onCheckEmail }) => {
  const signInHref = getViewURL("SIGN_IN");
  const forgotPassword = useMutation(ForgotPasswordMutation);
  const setView = useMutation(SetViewMutation);
  const onSubmit = useCallback(
    async ({ email }: FormProps) => {
      try {
        await forgotPassword({
          email,
        });
        onCheckEmail(email);
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          return error.invalidArgs;
        }
        return { [FORM_ERROR]: error.message };
      }
      return;
    },
    [forgotPassword]
  );
  const onGotoSignIn = useCallback(
    (e: React.MouseEvent) => {
      setView({ view: "SIGN_IN", history: "push" });
      if (e.preventDefault) {
        e.preventDefault();
      }
    },
    [setView]
  );

  return (
    <div data-testid="forgotPassword-container">
      <Bar>
        <Localized id="forgotPassword-forgotPasswordHeader">
          <Title>Forgot Password?</Title>
        </Localized>
      </Bar>
      <SubBar>
        <Typography variant="bodyCopy" container={Flex}>
          <Localized id="forgotPassword-gotBackToSignIn">
            <TextLink href={signInHref} onClick={onGotoSignIn}>
              Go back to sign in page
            </TextLink>
          </Localized>
        </Typography>
      </SubBar>
      <Main data-testid="forgotPassword-main">
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <AutoHeight />
              <HorizontalGutter size="full">
                <Localized id="forgotPassword-enterEmailAndGetALink">
                  <Typography variant="bodyCopy">
                    Enter your email address below and we will send you a link
                    to reset your password.
                  </Typography>
                </Localized>
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
                      <Localized id="forgotPassword-emailAddressLabel">
                        <InputLabel htmlFor={input.name}>
                          Email Address
                        </InputLabel>
                      </Localized>
                      <Localized
                        id="forgotPassword-emailAddressTextField"
                        attrs={{ placeholder: true }}
                      >
                        <TextField
                          id={input.name}
                          placeholder="Email Address"
                          color={colorFromMeta(meta)}
                          disabled={submitting}
                          fullWidth
                          {...input}
                        />
                      </Localized>
                      <ValidationMessage meta={meta} fullWidth />
                    </FormField>
                  )}
                </Field>
                <Localized id="forgotPassword-sendEmailButton">
                  <Button
                    variant="filled"
                    color="primary"
                    size="large"
                    fullWidth
                    type="submit"
                    disabled={submitting}
                  >
                    Send Email
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

export default ForgotPasswordForm;
