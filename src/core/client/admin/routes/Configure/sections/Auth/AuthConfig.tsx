import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components";

import { OnInitValuesFct } from "./AuthConfigContainer";
import AuthIntegrationsConfig from "./AuthIntegrationsConfig";
import SessionConfigContainer from "./SessionConfigContainer";

interface Props {
  disabled?: boolean;
  auth: PropTypesOf<typeof AuthIntegrationsConfig>["auth"] &
    PropTypesOf<typeof SessionConfigContainer>["auth"];
  onInitValues: OnInitValuesFct;
}

const AuthConfig: FunctionComponent<Props> = ({
  disabled,
  auth,
  onInitValues,
}) => (
  <HorizontalGutter size="double" data-testid="configure-authContainer">
    <SessionConfigContainer
      auth={auth}
      disabled={disabled}
      onInitValues={onInitValues}
    />
    <AuthIntegrationsConfig
      disabled={disabled}
      auth={auth}
      onInitValues={onInitValues}
    />
  </HorizontalGutter>
);

export default AuthConfig;
