import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { HorizontalGutter } from "talk-ui/components";

import AuthIntegrationsConfig from "./AuthIntegrationsConfig";

interface Props {
  disabled?: boolean;
  auth: PropTypesOf<typeof AuthIntegrationsConfig>["auth"];
  onInitValues: (values: any) => void;
}

const AuthConfig: StatelessComponent<Props> = ({
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
