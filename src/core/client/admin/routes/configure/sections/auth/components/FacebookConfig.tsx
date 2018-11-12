import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { HorizontalGutter, TextLink, Typography } from "talk-ui/components";

import HorizontalRule from "../../../components/HorizontalRule";
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

const FacebookConfig: StatelessComponent<Props> = ({
  disabled,
  callbackURL,
}) => (
  <ConfigBoxWithToggleField
    title={
      <Localized id="configure-auth-facebook-loginWith">
        <span>Login with Facebook</span>
      </Localized>
    }
    name="auth.integrations.facebook.enabled"
    disabled={disabled}
  >
    {disabledInside => (
      <HorizontalGutter size="double">
        <Localized
          id="configure-auth-facebook-toEnableIntegration"
          link={<FacebookLink />}
        >
          <Typography>
            To enable the integration with Facebook Authentication, you need to
            create and set up a web application. For more information visit:<br />
            https://developers.facebook.com/docs/facebook-login/web
          </Typography>
        </Localized>
        <HorizontalRule />
        <RedirectField url={callbackURL} />
        <HorizontalRule />
        <ClientIDField
          name="auth.integrations.facebook.clientID"
          disabled={disabledInside}
        />
        <ClientSecretField
          name="auth.integrations.facebook.clientSecret"
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
      </HorizontalGutter>
    )}
  </ConfigBoxWithToggleField>
);

export default FacebookConfig;
