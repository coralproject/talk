import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { PropTypesOf } from "coral-framework/types";

import Header from "../../Header";
import HorizontalRule from "../../HorizontalRule";
import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import RegistrationField from "./RegistrationField";
import SSOKeyFieldContainer from "./SSOKeyFieldContainer";
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
  sso: PropTypesOf<typeof SSOKeyFieldContainer>["sso"];
}

const SSOConfig: FunctionComponent<Props> = ({ disabled, sso }) => (
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
        <SSOKeyRotationQuery></SSOKeyRotationQuery>
        <HorizontalRule></HorizontalRule>
        <SSOKeyFieldContainer sso={sso} disabled={disabledInside} />
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
