import { Localized } from "fluent-react/compat";
import { identity } from "lodash";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import {
  composeValidators,
  required,
  validateURL,
  Validator,
} from "talk-framework/lib/validation";
import {
  Button,
  Flex,
  FormField,
  HorizontalGutter,
  Icon,
  InputLabel,
  TextField,
  TextLink,
  Typography,
} from "talk-ui/components";

import HorizontalRule from "../../../components/HorizontalRule";
import ClientIDField from "./ClientIDField";
import ClientSecretField from "./ClientSecretField";
import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import ConfigDescription from "./ConfigDescription";
import styles from "./OIDCConfig.css";
import RedirectField from "./RedirectField";
import RegistrationField from "./RegistrationField";
import TargetFilterField from "./TargetFilterField";
import ValidationMessage from "./ValidationMessage";

interface Props {
  index: number;
  disabled?: boolean;
  callbackURL: string;
  disableForDiscover?: boolean;
  onDiscover?: () => void;
}

const OIDCLink = () => (
  <TextLink target="_blank">{"https://openid.net/connect/"}</TextLink>
);

const OIDCConfig: StatelessComponent<Props> = ({
  disabled,
  callbackURL,
  index,
  onDiscover,
  disableForDiscover,
}) => {
  const validateWhenEnabled = (validator: Validator): Validator => (
    v,
    values
  ) => {
    if (values.auth.integrations.oidc[0].enabled) {
      return validator(v, values);
    }
    return "";
  };
  return (
    <ConfigBoxWithToggleField
      data-test={`configure-auth-oidc-container-${index}`}
      title={
        <Localized id="configure-auth-oidc-loginWith">
          <span>Login with OIDC</span>
        </Localized>
      }
      name={`auth.integrations.oidc.${index}.enabled`}
      disabled={disabled}
    >
      {disabledInside => (
        <HorizontalGutter size="double">
          <Localized id="configure-auth-oidc-toLearnMore" link={<OIDCLink />}>
            <Typography>
              {"To learn more: https://openid.net/connect/"}
            </Typography>
          </Localized>
          <HorizontalRule />
          <RedirectField
            url={callbackURL}
            description={
              <ConfigDescription container="div">
                <Flex itemGutter="half">
                  <Icon className={styles.redirectDescriptionIcon}>error</Icon>
                  <Localized id="configure-auth-oidc-redirectDescription">
                    <div>
                      For OpenID Connect, your Redirect URI will not appear
                      until you after you save this integration
                    </div>
                  </Localized>
                </Flex>
              </ConfigDescription>
            }
          />
          <HorizontalRule />
          <FormField>
            <Localized id="configure-auth-oidc-providerName">
              <InputLabel>Provider Name</InputLabel>
            </Localized>
            <Localized id="configure-auth-oidc-providerNameDescription">
              <ConfigDescription>
                The provider of the OIDC integration. This will be used when the
                name of the provider needs to be displayed, e.g. “Log in with
                {" <Facebook>"}”
              </ConfigDescription>
            </Localized>
            <Field
              name={`auth.integrations.oidc.${index}.name`}
              validate={validateWhenEnabled(required)}
              parse={identity}
            >
              {({ input, meta }) => (
                <>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    disabled={disabledInside}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </>
              )}
            </Field>
          </FormField>
          <ClientIDField
            validate={validateWhenEnabled(required)}
            name={`auth.integrations.oidc.${index}.clientID`}
            disabled={disabledInside}
          />
          <ClientSecretField
            validate={validateWhenEnabled(required)}
            name={`auth.integrations.oidc.${index}.clientSecret`}
            disabled={disabledInside}
          />
          <FormField>
            <Localized id="configure-auth-oidc-issuer">
              <InputLabel>Issuer</InputLabel>
            </Localized>
            <Localized id="configure-auth-oidc-issuerDescription">
              <ConfigDescription>
                After entering your Issuer information, click the Discover
                button to have Talk complete the remaining fields. You may also
                enter the information manually
              </ConfigDescription>
            </Localized>
            <Field
              name={`auth.integrations.oidc.${index}.issuer`}
              validate={validateWhenEnabled(
                composeValidators(required, validateURL)
              )}
              parse={identity}
            >
              {({ input, meta }) => (
                <>
                  <Flex direction="row" itemGutter="half" alignItems="center">
                    <TextField
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                      disabled={disabledInside || disableForDiscover}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                    <Button
                      id="configure-auth-oidc-discover-0"
                      variant="filled"
                      color="primary"
                      size="small"
                      disabled={disabledInside || disableForDiscover}
                      onClick={onDiscover}
                    >
                      Discover
                    </Button>
                  </Flex>
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </>
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-auth-oidc-authorizationURL">
              <InputLabel>authorizationURL</InputLabel>
            </Localized>
            <Field
              name={`auth.integrations.oidc.${index}.authorizationURL`}
              validate={validateWhenEnabled(
                composeValidators(required, validateURL)
              )}
              parse={identity}
            >
              {({ input, meta }) => (
                <>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    disabled={disabledInside || disableForDiscover}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </>
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-auth-oidc-tokenURL">
              <InputLabel>tokenURL</InputLabel>
            </Localized>
            <Field
              name={`auth.integrations.oidc.${index}.tokenURL`}
              validate={validateWhenEnabled(
                composeValidators(required, validateURL)
              )}
              parse={identity}
            >
              {({ input, meta }) => (
                <>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    disabled={disabledInside || disableForDiscover}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </>
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-auth-oidc-jwksURI">
              <InputLabel>jwksURI</InputLabel>
            </Localized>
            <Field
              name={`auth.integrations.oidc.${index}.jwksURI`}
              validate={validateWhenEnabled(
                composeValidators(required, validateURL)
              )}
              parse={identity}
            >
              {({ input, meta }) => (
                <>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    disabled={disabledInside || disableForDiscover}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
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
            name={`auth.integrations.oidc.${index}.targetFilter`}
            disabled={disabledInside}
          />
          <RegistrationField
            name={`auth.integrations.oidc.${index}.allowRegistration`}
            disabled={disabledInside}
          />
        </HorizontalGutter>
      )}
    </ConfigBoxWithToggleField>
  );
};

export default OIDCConfig;
