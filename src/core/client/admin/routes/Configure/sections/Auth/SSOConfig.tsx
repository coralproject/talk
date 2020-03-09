import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { ExternalLink } from "coral-framework/lib/i18n/components";
import { FormFieldDescription } from "coral-ui/components/v2";

import Header from "../../Header";
import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import RegistrationField from "./RegistrationField";
import SSOKeyRotationQuery from "./SSOKeyRotation/SSOKeyRotationQuery";
import TargetFilterField from "./TargetFilterField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment SSOConfig_formValues on Auth {
    integrations {
      sso {
        enabled
        allowRegistration
        targetFilter {
          admin
          stream
        }
      }
    }
  }
`;

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
    {disabledInside => (
      <>
        <Localized
          id="configure-auth-sso-description"
          IntroLink={
            <ExternalLink href="https://jwt.io/introduction/"></ExternalLink>
          }
          DocLink={
            <ExternalLink href="https://docs.coralproject.net/coral/v5/integrating/sso/"></ExternalLink>
          }
        >
          <FormFieldDescription>
            To enable integration with your existing authentication system, you
            will need to create a JWT Token to connect. You can learn more about
            creating a JWT Token with this introduction. See our documentation
            for additional information on single sign on.
          </FormFieldDescription>
        </Localized>
        <SSOKeyRotationQuery></SSOKeyRotationQuery>
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
