import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

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

interface Props {
  disabled?: boolean;
  callbackURL: string;
}

const FacebookLink = () => (
  <TextLink target="_blank">
    {"https://developers.facebook.com/docs/facebook-login/web"}
  </TextLink>
);

const isEnabled: Condition = (value, values) =>
  Boolean(values.auth.integrations.facebook.enabled);

const FacebookConfig: FunctionComponent<Props> = ({
  disabled,
  callbackURL,
}) => (
  <ConfigBoxWithToggleField
    data-testid="configure-auth-facebook-container"
    title={
      <Localized id="configure-auth-facebook-loginWith">
        <Header>Login with Facebook</Header>
      </Localized>
    }
    name="auth.integrations.facebook.enabled"
    disabled={disabled}
  >
    {disabledInside => (
      <>
        <Localized
          id="configure-auth-facebook-toEnableIntegration"
          Link={<FacebookLink />}
          br={<br />}
        >
          <FormFieldDescription>
            To enable the integration with Facebook Authentication, you need to
            create and set up a web application. For more information visit:
            <br />
            {"https://developers.facebook.com/docs/facebook-login/web"}
          </FormFieldDescription>
        </Localized>
        <RedirectField url={callbackURL} />
        <HorizontalRule />
        <ClientIDField
          name="auth.integrations.facebook.clientID"
          validate={validateWhen(isEnabled, required)}
          disabled={disabledInside}
        />
        <ClientSecretField
          name="auth.integrations.facebook.clientSecret"
          validate={validateWhen(isEnabled, required)}
          disabled={disabledInside}
        />
        <TargetFilterField
          label={
            <Localized id="configure-auth-facebook-useLoginOn">
              <span>Use Facebook login on</span>
            </Localized>
          }
          name="auth.integrations.facebook.targetFilter"
          disabled={disabledInside}
        />
        <RegistrationField
          name="auth.integrations.facebook.allowRegistration"
          disabled={disabledInside}
        />
      </>
    )}
  </ConfigBoxWithToggleField>
);

export default FacebookConfig;
