import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import {
  composeValidatorsWhen,
  Condition,
  required,
} from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  PasswordField,
  TextField,
} from "coral-ui/components";

import OnOffField from "../../OnOffField";
import Subheader from "../../Subheader";
import { FormProps } from "./EmailConfigContainer";

interface Props {
  disabled: boolean;
}

const isEnabled: Condition<any, FormProps> = (value, values) =>
  Boolean(values.email.enabled);

const isAuthenticating: Condition<any, FormProps> = (value, values) =>
  Boolean(values.email.enabled && values.email.smtp.authentication);

const SMTP: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
    <FormField>
      <Localized id="configure-email-smtpHostLabel">
        <InputLabel>SMTP host</InputLabel>
      </Localized>
      <Localized id="configure-email-smtpHostDescription">
        <InputDescription>(ex. smtp.sendgrid.com)</InputDescription>
      </Localized>
      <Field
        name="email.smtp.host"
        validate={composeValidatorsWhen(isEnabled, required)}
      >
        {({ input, meta }) => (
          <>
            <TextField
              id={input.name}
              fullWidth
              disabled={disabled}
              color={colorFromMeta(meta)}
              {...input}
            />
            <ValidationMessage fullWidth meta={meta} />
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
      <Field
        name="email.smtp.port"
        validate={composeValidatorsWhen(isEnabled, required)}
      >
        {({ input, meta }) => (
          <>
            <TextField
              id={input.name}
              type="number"
              fullWidth
              disabled={disabled}
              color={colorFromMeta(meta)}
              {...input}
            />
            <ValidationMessage fullWidth meta={meta} />
          </>
        )}
      </Field>
    </FormField>
    <FormField>
      <Localized id="configure-email-smtpTLSLabel">
        <InputLabel>TLS</InputLabel>
      </Localized>
      <OnOffField
        name="email.smtp.secure"
        disabled={disabled}
        validate={composeValidatorsWhen(isEnabled, required)}
      />
    </FormField>
    <FormField>
      <Localized id="configure-email-smtpAuthenticationLabel">
        <InputLabel>SMTP Authentication</InputLabel>
      </Localized>
      <OnOffField
        name="email.smtp.authentication"
        disabled={disabled}
        validate={composeValidatorsWhen(isEnabled, required)}
      />
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
            <Field
              name="email.smtp.username"
              validate={composeValidatorsWhen(isAuthenticating, required)}
            >
              {({ input, meta }) => (
                <>
                  <TextField
                    id={input.name}
                    disabled={disabled || !enabled}
                    fullWidth
                    color={colorFromMeta(meta)}
                    {...input}
                  />
                  <ValidationMessage fullWidth meta={meta} />
                </>
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-email-smtpPasswordLabel">
              <InputLabel>Password</InputLabel>
            </Localized>
            <Field
              name="email.smtp.password"
              validate={composeValidatorsWhen(isAuthenticating, required)}
            >
              {({ input, meta }) => (
                <>
                  <PasswordField
                    id={input.name}
                    autoComplete="new-password"
                    disabled={disabled || !enabled}
                    fullWidth
                    color={colorFromMeta(meta)}
                    {...input}
                  />
                  <ValidationMessage fullWidth meta={meta} />
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
