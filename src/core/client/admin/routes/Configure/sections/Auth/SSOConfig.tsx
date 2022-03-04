import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { ExternalLink } from "coral-framework/lib/i18n/components";
import { FormFieldDescription } from "coral-ui/components/v2";

import Header from "../../Header";
import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import RegistrationField from "./RegistrationField";
import SSOSigningSecretRotationQuery from "./SSOSigningSecretRotation/SSOSigningSecretRotationQuery";
import TargetFilterField from "./TargetFilterField";

interface Props {
  disabled?: boolean;
}

const SSOConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBoxWithToggleField
    title={
      <Localized id="configure-auth-sso-loginWith">
        <Header container="h2">Login with SSO</Header>
      </Localized>
    }
    name="auth.integrations.sso.enabled"
    disabled={disabled}
    data-testid="configure-auth-sso"
  >
    {(disabledInside) => (
      <>
        <Localized
          id="configure-auth-sso-description"
          IntroLink={
            <ExternalLink href="https://jwt.io/introduction/"></ExternalLink>
          }
          DocLink={
            <ExternalLink href="https://docs.coralproject.net/sso"></ExternalLink>
          }
        >
          <FormFieldDescription>
            To enable integration with your existing authentication system, you
            will need to create a JWT Token to connect. You can learn more about
            creating a JWT Token with this introduction. See our documentation
            for additional information on single sign on.
          </FormFieldDescription>
        </Localized>
        <SSOSigningSecretRotationQuery
          disabled={disabledInside}
        ></SSOSigningSecretRotationQuery>
        <TargetFilterField
          label={
            <Localized id="configure-auth-sso-useLoginOn">
              <span>Use SSO login on</span>
            </Localized>
          }
          name="auth.integrations.sso.targetFilter"
          disabled={disabledInside}
        />
        <RegistrationField
          name="auth.integrations.sso.allowRegistration"
          disabled={disabledInside}
        />
      </>
    )}
  </ConfigBoxWithToggleField>
);

export default SSOConfig;
