import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  Condition,
  required,
  validateWhen,
} from "coral-framework/lib/validation";
import { FormFieldDescription, TextLink } from "coral-ui/components/v2";

import Header from "../../Header";
import HorizontalRule from "../../HorizontalRule";
import ClientIDField from "./ClientIDField";
import ClientSecretField from "./ClientSecretField";
import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import RedirectField from "./RedirectField";
import RegistrationField from "./RegistrationField";
import TargetFilterField from "./TargetFilterField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment GoogleConfig_formValues on Auth {
    integrations {
      google {
        enabled
        allowRegistration
        targetFilter {
          admin
          stream
        }
        clientID
        clientSecret
      }
    }
  }
`;
interface Props {
  disabled?: boolean;
  callbackURL: string;
}

const GoogleLink = () => (
  <TextLink target="_blank">
    {
      "https://developers.google.com/identity/protocols/OAuth2WebServer#creatingcred"
    }
  </TextLink>
);

const isEnabled: Condition = (value, values) =>
  Boolean(values.auth.integrations.google.enabled);

const GoogleConfig: FunctionComponent<Props> = ({ disabled, callbackURL }) => (
  <ConfigBoxWithToggleField
    title={
      <Localized id="configure-auth-google-loginWith">
        <Header container="h2">Login with Google</Header>
      </Localized>
    }
    name="auth.integrations.google.enabled"
    disabled={disabled}
    data-testid="configure-auth-google"
  >
    {(disabledInside) => (
      <>
        <Localized
          id="configure-auth-google-toEnableIntegration"
          elems={{ Link: <GoogleLink /> }}
        >
          <FormFieldDescription>
            To enable the integration with Google Authentication you need to
            create and set up a web application. For more information visit:
            <br />
            {
              "https://developers.google.com/identity/protocols/OAuth2WebServer#creatingcred"
            }
          </FormFieldDescription>
        </Localized>
        <RedirectField url={callbackURL} />
        <HorizontalRule />
        <ClientIDField
          name="auth.integrations.google.clientID"
          validate={validateWhen(isEnabled, required)}
          disabled={disabledInside}
        />
        <ClientSecretField
          name="auth.integrations.google.clientSecret"
          validate={validateWhen(isEnabled, required)}
          disabled={disabledInside}
        />
        <TargetFilterField
          label={
            <Localized id="configure-auth-google-useLoginOn">
              <span>Use Google login on</span>
            </Localized>
          }
          name="auth.integrations.google.targetFilter"
          disabled={disabledInside}
        />
        <RegistrationField
          name="auth.integrations.google.allowRegistration"
          disabled={disabledInside}
        />
      </>
    )}
  </ConfigBoxWithToggleField>
);

export default GoogleConfig;
