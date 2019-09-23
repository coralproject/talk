import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  colorFromMeta,
  parseEmptyAsNull,
  ValidationMessage,
} from "coral-framework/lib/form";
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
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  TextLink,
  Typography,
} from "coral-ui/components";

import HorizontalRule from "../../HorizontalRule";
import { FormProps } from "./AuthConfigContainer";
import ClientIDField from "./ClientIDField";
import ClientSecretField from "./ClientSecretField";
import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import RedirectField from "./RedirectField";
import RegistrationField from "./RegistrationField";
import TargetFilterField from "./TargetFilterField";

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
          <span>Login with OIDC</span>
        </Localized>
      }
      name="auth.integrations.oidc.enabled"
      disabled={disabled}
    >
      {disabledInside => (
        <HorizontalGutter size="double">
          <Localized id="configure-auth-oidc-toLearnMore" Link={<OIDCLink />}>
            <Typography>
              {"To learn more: https://openid.net/connect/"}
            </Typography>
          </Localized>
          <HorizontalRule />
          <RedirectField url={callbackURL} />
          <HorizontalRule />
          <FormField>
            <Localized id="configure-auth-oidc-providerName">
              <InputLabel>Provider name</InputLabel>
            </Localized>
            <Localized id="configure-auth-oidc-providerNameDescription">
              <InputDescription>
                The provider of the OIDC integration. This will be used when the
                name of the provider needs to be displayed, e.g. “Log in with
                {" <Facebook>"}”
              </InputDescription>
            </Localized>
            <Field
              name="auth.integrations.oidc.name"
              validate={composeValidatorsWhen(isEnabled, required)}
              parse={parseEmptyAsNull}
            >
              {({ input, meta }) => (
                <>
                  <TextField
                    disabled={disabledInside}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    color={colorFromMeta(meta)}
                    fullWidth
                    {...input}
                  />
                  <ValidationMessage meta={meta} />
                </>
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
            <Localized id="configure-auth-oidc-issuer">
              <InputLabel>Issuer</InputLabel>
            </Localized>
            <Localized id="configure-auth-oidc-issuerDescription">
              <InputDescription>
                After entering your Issuer information, click the Discover
                button to have Coral complete the remaining fields. You may also
                enter the information manually
              </InputDescription>
            </Localized>
            <Field
              name="auth.integrations.oidc.issuer"
              validate={composeValidatorsWhen(isEnabled, required, validateURL)}
              parse={parseEmptyAsNull}
            >
              {({ input, meta }) => (
                <>
                  <Flex direction="row" itemGutter="half" alignItems="center">
                    <TextField
                      disabled={disabledInside || disableForDiscover}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      color={colorFromMeta(meta)}
                      fullWidth
                      {...input}
                    />
                    <Button
                      id="configure-auth-oidc-discover"
                      variant="filled"
                      color="primary"
                      size="small"
                      disabled={disabledInside || disableForDiscover}
                      onClick={onDiscover}
                    >
                      Discover
                    </Button>
                  </Flex>
                  <ValidationMessage meta={meta} />
                </>
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-auth-oidc-authorizationURL">
              <InputLabel>authorizationURL</InputLabel>
            </Localized>
            <Field
              name="auth.integrations.oidc.authorizationURL"
              validate={composeValidatorsWhen(isEnabled, required, validateURL)}
              parse={parseEmptyAsNull}
            >
              {({ input, meta }) => (
                <>
                  <TextField
                    disabled={disabledInside || disableForDiscover}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    color={colorFromMeta(meta)}
                    fullWidth
                    {...input}
                  />
                  <ValidationMessage meta={meta} />
                </>
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-auth-oidc-tokenURL">
              <InputLabel>tokenURL</InputLabel>
            </Localized>
            <Field
              name="auth.integrations.oidc.tokenURL"
              validate={composeValidatorsWhen(isEnabled, required, validateURL)}
              parse={parseEmptyAsNull}
            >
              {({ input, meta }) => (
                <>
                  <TextField
                    disabled={disabledInside || disableForDiscover}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    color={colorFromMeta(meta)}
                    fullWidth
                    {...input}
                  />
                  <ValidationMessage meta={meta} />
                </>
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-auth-oidc-jwksURI">
              <InputLabel>jwksURI</InputLabel>
            </Localized>
            <Field
              name="auth.integrations.oidc.jwksURI"
              validate={composeValidatorsWhen(isEnabled, required, validateURL)}
              parse={parseEmptyAsNull}
            >
              {({ input, meta }) => (
                <>
                  <TextField
                    disabled={disabledInside || disableForDiscover}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    color={colorFromMeta(meta)}
                    fullWidth
                    {...input}
                  />
                  <ValidationMessage meta={meta} />
                </>
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
        </HorizontalGutter>
      )}
    </ConfigBoxWithToggleField>
  );
};

export default OIDCConfig;
