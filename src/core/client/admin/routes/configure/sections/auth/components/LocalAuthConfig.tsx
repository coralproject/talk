import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { HorizontalGutter } from "talk-ui/components";

import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import RegistrationField from "./RegistrationField";
import TargetFilterField from "./TargetFilterField";

interface Props {
  disabled?: boolean;
}

const LocalAuthConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBoxWithToggleField
    title={
      <Localized id="configure-auth-local-loginWith">
        <span>Login with LocalAuth</span>
      </Localized>
    }
    name="auth.integrations.local.enabled"
    disabled={disabled}
  >
    {disabledInside => (
      <HorizontalGutter size="double">
        <TargetFilterField
          label={
            <Localized id="configure-auth-local-useLoginOn">
              <span>Use LocalAuth login on</span>
            </Localized>
          }
          name="auth.integrations.local.targetFilter"
          disabled={disabledInside}
        />
        <RegistrationField
          name="auth.integrations.local.allowRegistration"
          disabled={disabledInside}
        />
      </HorizontalGutter>
    )}
  </ConfigBoxWithToggleField>
);

export default LocalAuthConfig;
