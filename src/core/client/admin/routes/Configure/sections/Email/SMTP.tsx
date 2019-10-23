import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  FieldSet,
  FormField,
  Label,
  PasswordField,
  TextField,
} from "coral-admin/ui/components";
import {
  colorFromMeta,
  parseEmptyAsNull,
  ValidationMessage,
} from "coral-framework/lib/form";
import {
  composeValidatorsWhen,
  Condition,
  required,
} from "coral-framework/lib/validation";
import { HorizontalGutter } from "coral-ui/components";

import HelperText from "../../HelperText";
import OnOffField from "../../OnOffField";
import SubHeader from "../../SubHeader";
import { FormProps } from "./EmailConfigContainer";

interface Props {
  disabled: boolean;
}

const isEnabled: Condition<any, FormProps> = (value, values) =>
  Boolean(values.email.enabled);

const isAuthenticating: Condition<any, FormProps> = (value, values) =>
  Boolean(values.email.enabled && values.email.smtp.authentication);

const SMTP: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter spacing={4} container={<FieldSet />}>
    <FormField>
      <HorizontalGutter spacing={1}>
        <Localized id="configure-email-smtpHostLabel">
          <Label>SMTP host</Label>
        </Localized>
        <Localized id="configure-email-smtpHostDescription">
          <HelperText>(ex. smtp.sendgrid.com)</HelperText>
        </Localized>
      </HorizontalGutter>
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
      <HorizontalGutter spacing={1}>
        <Localized id="configure-email-smtpPortLabel">
          <Label>SMTP port</Label>
        </Localized>
        <Localized id="configure-email-smtpPortDescription">
          <HelperText>(ex. 25)</HelperText>
        </Localized>
      </HorizontalGutter>
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
        <Label>TLS</Label>
      </Localized>
      <OnOffField
        name="email.smtp.secure"
        disabled={disabled}
        validate={composeValidatorsWhen(isEnabled, required)}
      />
    </FormField>
    <FormField>
      <Localized id="configure-email-smtpAuthenticationLabel">
        <Label>SMTP authentication</Label>
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
            <SubHeader>Email credentials</SubHeader>
          </Localized>
          <FormField>
            <Localized id="configure-email-smtpUsernameLabel">
              <Label>Username</Label>
            </Localized>
            <Field
              name="email.smtp.username"
              parse={parseEmptyAsNull}
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
              <Label>Password</Label>
            </Localized>
            <Field
              name="email.smtp.password"
              parse={parseEmptyAsNull}
              validate={composeValidatorsWhen(isAuthenticating, required)}
            >
              {({ input, meta }) => (
                <>
                  <PasswordField
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
        </>
      )}
    </Field>
  </HorizontalGutter>
);

export default SMTP;
