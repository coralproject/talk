import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import Main from "coral-auth/components/Main";
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
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  Typography,
} from "coral-ui/components/v2";

import ForgotPasswordMutation from "./ForgotPasswordMutation";

interface FormProps {
  email: string;
}

interface Props {
  onCheckEmail: (email: string) => void;
}

const ForgotPasswordForm: FunctionComponent<Props> = (props) => {
  const forgotPassword = useMutation(ForgotPasswordMutation);
  const onSubmit = useCallback(
    async (form: FormProps) => {
      try {
        await forgotPassword(form);
        props.onCheckEmail(form.email);
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
  return (
    <div data-testid="admin-forgotPassword-container">
      <Main data-testid="admin-forgotPassword-main">
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
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
                          {...input}
                          id={input.name}
                          placeholder="Email Address"
                          color={colorFromMeta(meta)}
                          disabled={submitting}
                          type="email"
                          fullWidth
                        />
                      </Localized>
                      <ValidationMessage meta={meta} fullWidth />
                    </FormField>
                  )}
                </Field>
                <Localized id="forgotPassword-sendEmailButton">
                  <Button
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
