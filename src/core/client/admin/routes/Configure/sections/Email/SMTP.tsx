import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  PasswordField,
  TextField,
  ValidationMessage,
} from "coral-ui/components";

import OnOffField from "../../OnOffField";
import Subheader from "../../Subheader";

interface Props {
  disabled: boolean;
}

const SMTP: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
    <FormField>
      <Localized id="configure-email-smtpHostLabel">
        <InputLabel>SMTP host</InputLabel>
      </Localized>
      <Localized id="configure-email-smtpHostDescription">
        <InputDescription>(ex. smtp.sendgrid.com)</InputDescription>
      </Localized>
      <Field name="email.smtp.host">
        {({ input, meta }) => (
          <>
            <TextField
              id={input.name}
              fullWidth
              disabled={disabled}
              {...input}
            />
            {meta.touched && (meta.error || meta.submitError) && (
              <ValidationMessage fullWidth>
                {meta.error || meta.submitError}
              </ValidationMessage>
            )}
          </>
        )}
      </Field>
    </FormField>
    <FormField>
      <Localized id="configure-email-smtpPortLabel">
        <InputLabel>SMTP port</InputLabel>
      </Localized>
      <Localized id="configure-email-smtpPortDescription">
        <InputDescription>(ex. 25)</InputDescription>
      </Localized>
      <Field name="email.smtp.port">
        {({ input, meta }) => (
          <>
            <TextField
              id={input.name}
              type="number"
              fullWidth
              disabled={disabled}
              {...input}
            />
            {meta.touched && (meta.error || meta.submitError) && (
              <ValidationMessage fullWidth>
                {meta.error || meta.submitError}
              </ValidationMessage>
            )}
          </>
        )}
      </Field>
    </FormField>
    <FormField>
      <Localized id="configure-email-smtpTLSLabel">
        <InputLabel>TLS</InputLabel>
      </Localized>
      <OnOffField name="email.smtp.secure" disabled={disabled} />
    </FormField>
    <FormField>
      <Localized id="configure-email-smtpAuthenticationLabel">
        <InputLabel>SMTP Authentication</InputLabel>
      </Localized>
      <OnOffField name="email.smtp.authentication" disabled={disabled} />
    </FormField>
    <Field name="email.smtp.authentication" subscription={{ value: true }}>
      {({ input: { value: enabled } }) => (
        <>
          <Localized id="configure-email-smtpCredentialsHeader">
            <Subheader>Email credentials</Subheader>
          </Localized>
          <FormField>
            <Localized id="configure-email-smtpUsernameLabel">
              <InputLabel>Username</InputLabel>
            </Localized>
            <Field name="email.smtp.username">
              {({ input, meta }) => (
                <>
                  <TextField
                    id={input.name}
                    fullWidth
                    disabled={disabled || !enabled}
                    {...input}
                  />
                  {meta.touched && (meta.error || meta.submitError) && (
                    <ValidationMessage fullWidth>
                      {meta.error || meta.submitError}
                    </ValidationMessage>
                  )}
                </>
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-email-smtpPasswordLabel">
              <InputLabel>Password</InputLabel>
            </Localized>
            <Field name="email.smtp.password">
              {({ input, meta }) => (
                <>
                  <PasswordField
                    id={input.name}
                    color={
                      meta.touched && (meta.error || meta.submitError)
                        ? "error"
                        : "regular"
                    }
                    {...input}
                    disabled={disabled || !enabled}
                    fullWidth
                  />
                  {meta.touched && (meta.error || meta.submitError) && (
                    <ValidationMessage fullWidth>
                      {meta.error || meta.submitError}
                    </ValidationMessage>
                  )}
                </>
              )}
            </Field>
          </FormField>
        </>
      )}
    </Field>
  </HorizontalGutter>
);

export default SMTP;
