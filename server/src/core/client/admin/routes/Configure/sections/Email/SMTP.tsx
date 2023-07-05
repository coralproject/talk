import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import {
  colorFromMeta,
  parseEmptyAsNull,
  parseIntegerNullable,
  ValidationMessage,
} from "coral-framework/lib/form";
import {
  composeValidatorsWhen,
  Condition,
  required,
} from "coral-framework/lib/validation";
import {
  FormField,
  FormFieldHeader,
  Label,
  PasswordField,
} from "coral-ui/components/v2";

import HelperText from "../../HelperText";
import OnOffField from "../../OnOffField";
import Subheader from "../../Subheader";
import TextFieldWithValidation from "../../TextFieldWithValidation";
import { FormProps } from "./EmailConfigContainer";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment SMTP_formValues on EmailConfiguration {
    enabled
    smtp {
      host
      port
      secure
      authentication
      username
      password
    }
  }
`;
interface Props {
  disabled: boolean;
}

const isEnabled: Condition<any, FormProps> = (value, values) =>
  Boolean(values.email && values.email.enabled);

const isAuthenticating: Condition<any, FormProps> = (value, values) =>
  Boolean(values.email.enabled && values.email.smtp.authentication);

const SMTP: FunctionComponent<Props> = ({ disabled }) => (
  <>
    <FormField>
      <FormFieldHeader>
        <Localized id="configure-email-smtpHostLabel">
          <Label>SMTP host</Label>
        </Localized>
        <Localized id="configure-email-smtpHostDescription">
          <HelperText>(ex. smtp.sendgrid.net)</HelperText>
        </Localized>
      </FormFieldHeader>
      <Field
        name="email.smtp.host"
        validate={composeValidatorsWhen(isEnabled, required)}
      >
        {({ input, meta }) => (
          <TextFieldWithValidation
            {...input}
            id={input.name}
            fullWidth
            disabled={disabled}
            meta={meta}
          />
        )}
      </Field>
    </FormField>
    <FormField>
      <FormFieldHeader>
        <Localized id="configure-email-smtpPortLabel">
          <Label>SMTP port</Label>
        </Localized>
        <Localized id="configure-email-smtpPortDescription">
          <HelperText>(ex. 25)</HelperText>
        </Localized>
      </FormFieldHeader>
      <Field
        name="email.smtp.port"
        validate={composeValidatorsWhen(isEnabled, required)}
        parse={parseIntegerNullable}
      >
        {({ input, meta }) => (
          <TextFieldWithValidation
            {...input}
            id={input.name}
            type="number"
            fullWidth
            disabled={disabled}
            meta={meta}
          />
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
            <Subheader>Email credentials</Subheader>
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
                <TextFieldWithValidation
                  {...input}
                  id={input.name}
                  disabled={disabled || !enabled}
                  fullWidth
                  meta={meta}
                />
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
                    {...input}
                    id={input.name}
                    disabled={disabled || !enabled}
                    autoComplete="new-password"
                    fullWidth
                    color={colorFromMeta(meta)}
                  />
                  <ValidationMessage fullWidth meta={meta} />
                </>
              )}
            </Field>
          </FormField>
        </>
      )}
    </Field>
  </>
);

export default SMTP;
