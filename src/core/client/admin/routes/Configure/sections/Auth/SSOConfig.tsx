import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";

import Header from "../../Header";
import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import RegistrationField from "./RegistrationField";
import SSOKeyFieldContainer from "./SSOKeyFieldContainer";
import TargetFilterField from "./TargetFilterField";

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
  >
    {disabledInside => (
      <>
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
