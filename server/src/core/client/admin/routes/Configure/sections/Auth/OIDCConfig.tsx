import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { colorFromMeta, parseEmptyAsNull } from "coral-framework/lib/form";
import {
  composeValidatorsWhen,
  Condition,
  required,
  validateURL,
} from "coral-framework/lib/validation";
import {
  Button,
  Flex,
  FormField,
  FormFieldDescription,
  FormFieldHeader,
  HelperText,
  Label,
  TextField,
  TextLink,
} from "coral-ui/components/v2";

import Header from "../../Header";
import HorizontalRule from "../../HorizontalRule";
import TextFieldWithValidation from "../../TextFieldWithValidation";
import ValidationMessage from "../../ValidationMessage";
import { FormProps } from "./AuthConfigContainer";
import ClientIDField from "./ClientIDField";
import ClientSecretField from "./ClientSecretField";
import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import RedirectField from "./RedirectField";
import RegistrationField from "./RegistrationField";
import TargetFilterField from "./TargetFilterField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment OIDCConfig_formValues on Auth {
    integrations {
      oidc {
        enabled
        allowRegistration
        targetFilter {
          admin
          stream
        }
        name
        clientID
        clientSecret
        authorizationURL
        tokenURL
        jwksURI
        issuer
      }
    }
  }
`;

interface Props {
  disabled?: boolean;
  callbackURL: string;
  disableForDiscover?: boolean;
  onDiscover?: () => void;
}

const OIDCLink = () => (
  <TextLink target="_blank">{"https://openid.net/connect/"}</TextLink>
);

const isEnabled: Condition<any, FormProps> = (value, values) =>
  Boolean(values.auth.integrations.oidc.enabled);

const OIDCConfig: FunctionComponent<Props> = ({
  disabled,
  callbackURL,
  onDiscover,
  disableForDiscover,
}) => {
  return (
    <ConfigBoxWithToggleField
      data-testid="configure-auth-oidc-container"
      title={
        <Localized id="configure-auth-oidc-loginWith">
          <Header container="h2">Login with OIDC</Header>
        </Localized>
      }
      name="auth.integrations.oidc.enabled"
      disabled={disabled}
    >
      {(disabledInside) => (
        <>
          <Localized
            id="configure-auth-oidc-toLearnMore"
            elems={{ Link: <OIDCLink /> }}
          >
            <FormFieldDescription>
              {"To learn more: https://openid.net/connect/"}
            </FormFieldDescription>
          </Localized>
          <RedirectField url={callbackURL} />
          <HorizontalRule />
          <FormField>
            <FormFieldHeader>
              <Localized id="configure-auth-oidc-providerName">
                <Label htmlFor="auth.integrations.oidc.name">
                  Provider name
                </Label>
              </Localized>
              <Localized id="configure-auth-oidc-providerNameDescription">
                <HelperText>
                  The provider of the OIDC integration. This will be used when
                  the name of the provider needs to be displayed, e.g. “Log in
                  with
                  {" <Facebook>"}”
                </HelperText>
              </Localized>
            </FormFieldHeader>
            <Field
              name="auth.integrations.oidc.name"
              validate={composeValidatorsWhen(isEnabled, required)}
              parse={parseEmptyAsNull}
            >
              {({ input, meta }) => (
                <TextFieldWithValidation
                  {...input}
                  id={input.name}
                  disabled={disabledInside}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  color={colorFromMeta(meta)}
                  fullWidth
                  meta={meta}
                />
              )}
            </Field>
          </FormField>
          <ClientIDField
            validate={composeValidatorsWhen(isEnabled, required)}
            name="auth.integrations.oidc.clientID"
            disabled={disabledInside}
          />
          <ClientSecretField
            validate={composeValidatorsWhen(isEnabled, required)}
            name="auth.integrations.oidc.clientSecret"
            disabled={disabledInside}
          />
          <FormField>
            <FormFieldHeader>
              <Localized id="configure-auth-oidc-issuer">
                <Label htmlFor="auth.integrations.oidc.issuer">Issuer</Label>
              </Localized>
              <Localized id="configure-auth-oidc-issuerDescription">
                <HelperText>
                  After entering your Issuer information, click the Discover
                  button to have Coral complete the remaining fields. You may
                  also enter the information manually
                </HelperText>
              </Localized>
            </FormFieldHeader>
            <Field
              name="auth.integrations.oidc.issuer"
              validate={composeValidatorsWhen(isEnabled, required, validateURL)}
              parse={parseEmptyAsNull}
            >
              {({ input, meta }) => (
                <>
                  <Flex direction="row" itemGutter="half" alignItems="center">
                    <TextField
                      {...input}
                      id={input.name}
                      disabled={disabledInside || disableForDiscover}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      color={colorFromMeta(meta)}
                      fullWidth
                    />
                    <Button
                      id="configure-auth-oidc-discover"
                      disabled={disabledInside || disableForDiscover}
                      onClick={onDiscover}
                    >
                      Discover
                    </Button>
                  </Flex>
                  <ValidationMessage meta={meta} fullWidth />
                </>
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-auth-oidc-authorizationURL">
              <Label>authorizationURL</Label>
            </Localized>
            <Field
              name="auth.integrations.oidc.authorizationURL"
              validate={composeValidatorsWhen(isEnabled, required, validateURL)}
              parse={parseEmptyAsNull}
            >
              {({ input, meta }) => (
                <TextFieldWithValidation
                  {...input}
                  id={input.name}
                  disabled={disabledInside || disableForDiscover}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  fullWidth
                  meta={meta}
                />
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-auth-oidc-tokenURL">
              <Label>tokenURL</Label>
            </Localized>
            <Field
              name="auth.integrations.oidc.tokenURL"
              validate={composeValidatorsWhen(isEnabled, required, validateURL)}
              parse={parseEmptyAsNull}
            >
              {({ input, meta }) => (
                <TextFieldWithValidation
                  {...input}
                  id={input.name}
                  disabled={disabledInside || disableForDiscover}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  meta={meta}
                  fullWidth
                />
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-auth-oidc-jwksURI">
              <Label>jwksURI</Label>
            </Localized>
            <Field
              name="auth.integrations.oidc.jwksURI"
              validate={composeValidatorsWhen(isEnabled, required, validateURL)}
              parse={parseEmptyAsNull}
            >
              {({ input, meta }) => (
                <TextFieldWithValidation
                  {...input}
                  id={input.name}
                  disabled={disabledInside || disableForDiscover}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  meta={meta}
                  fullWidth
                />
              )}
            </Field>
          </FormField>
          <TargetFilterField
            label={
              <Localized id="configure-auth-oidc-useLoginOn">
                <span>Use OIDC login on</span>
              </Localized>
            }
            name="auth.integrations.oidc.targetFilter"
            disabled={disabledInside}
          />
          <RegistrationField
            name="auth.integrations.oidc.allowRegistration"
            disabled={disabledInside}
          />
        </>
      )}
    </ConfigBoxWithToggleField>
  );
};

export default OIDCConfig;
