import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components";

import Header from "../../Header";
import FacebookConfigContainer from "./FacebookConfigContainer";
import GoogleConfigContainer from "./GoogleConfigContainer";
import LocalAuthConfigContainer from "./LocalAuthConfigContainer";
import OIDCConfigContainer from "./OIDCConfigContainer";
import SSOConfigContainer from "./SSOConfigContainer";

interface Props {
  disabled?: boolean;
  auth: PropTypesOf<typeof FacebookConfigContainer>["auth"] &
    PropTypesOf<typeof FacebookConfigContainer>["authReadOnly"] &
    PropTypesOf<typeof GoogleConfigContainer>["auth"] &
    PropTypesOf<typeof GoogleConfigContainer>["authReadOnly"] &
    PropTypesOf<typeof SSOConfigContainer>["auth"] &
    PropTypesOf<typeof SSOConfigContainer>["authReadOnly"] &
    PropTypesOf<typeof LocalAuthConfigContainer>["auth"] &
    PropTypesOf<typeof OIDCConfigContainer>["auth"] &
    PropTypesOf<typeof OIDCConfigContainer>["authReadOnly"];
  onInitValues: (values: any) => void;
}

const AuthIntegrationsConfig: FunctionComponent<Props> = ({
  disabled,
  auth,
  onInitValues,
}) => (
  <HorizontalGutter size="double">
    <Localized id="configure-auth-authIntegrations">
      <Header>Auth Integrations</Header>
    </Localized>
    <LocalAuthConfigContainer
      disabled={disabled}
      auth={auth}
      onInitValues={onInitValues}
    />
    <OIDCConfigContainer
      disabled={disabled}
      auth={auth}
      authReadOnly={auth}
      onInitValues={onInitValues}
    />
    <SSOConfigContainer
      disabled={disabled}
      auth={auth}
      authReadOnly={auth}
      onInitValues={onInitValues}
    />
    <GoogleConfigContainer
      disabled={disabled}
      auth={auth}
      authReadOnly={auth}
      onInitValues={onInitValues}
    />
    <FacebookConfigContainer
      disabled={disabled}
      auth={auth}
      authReadOnly={auth}
      onInitValues={onInitValues}
    />
  </HorizontalGutter>
);

export default AuthIntegrationsConfig;
