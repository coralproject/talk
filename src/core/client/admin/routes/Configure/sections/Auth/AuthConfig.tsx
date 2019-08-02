import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components";

import { OnInitValuesFct } from "./AuthConfigContainer";
import AuthIntegrationsConfig from "./AuthIntegrationsConfig";

interface Props {
  disabled?: boolean;
  auth: PropTypesOf<typeof AuthIntegrationsConfig>["auth"];
  onInitValues: OnInitValuesFct;
}

const AuthConfig: FunctionComponent<Props> = ({
  disabled,
  auth,
  onInitValues,
}) => (
  <HorizontalGutter size="double" data-testid="configure-authContainer">
    <AuthIntegrationsConfig
      disabled={disabled}
      auth={auth}
      onInitValues={onInitValues}
    />
  </HorizontalGutter>
);

export default AuthConfig;
