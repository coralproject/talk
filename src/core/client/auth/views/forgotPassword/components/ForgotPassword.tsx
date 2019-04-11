import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";

import { Bar, Title } from "talk-auth/components//Header";
import Main from "talk-auth/components/Main";
import AutoHeightContainer from "talk-auth/containers/AutoHeightContainer";
import { OnSubmit } from "talk-framework/lib/form";
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
  Typography,
  ValidationMessage,
} from "talk-ui/components";

interface FormProps {
  email: string;
}

export interface ForgotPasswordForm {
  onSubmit: OnSubmit<FormProps>;
}

const ForgotPassword: StatelessComponent<ForgotPasswordForm> = props => {
  return (
    <div data-testid="forgotPassword-container">
      <Bar>
        <Localized id="forgotPassword-forgotPasswordHeader">
          <Title>Forgot Password</Title>
        </Localized>
      </Bar>
      <Main data-testid="forgotPassword-main">
        <Form onSubmit={props.onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <AutoHeightContainer />
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
                        <InputLabel>Email Address</InputLabel>
                      </Localized>
                      <Localized
                        id="forgotPassword-emailAddressTextField"
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
                          fullWidth
                          disabled={submitting}
                        />
                      </Localized>
                      {meta.touched && (meta.error || meta.submitError) && (
                        <ValidationMessage>
                          {meta.error || meta.submitError}
                        </ValidationMessage>
                      )}
                    </FormField>
                  )}
                </Field>
                <Localized id="forgotPassword-sendEmailButton">
                  <Button
                    variant="filled"
                    color="primary"
                    size="large"
                    fullWidth
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

export default ForgotPassword;
