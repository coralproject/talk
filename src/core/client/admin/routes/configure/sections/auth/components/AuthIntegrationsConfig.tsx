import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { HorizontalGutter } from "talk-ui/components";

import Header from "../../../components/Header";
import FacebookConfig from "../containers/FacebookConfigContainer";
import GoogleConfig from "../containers/GoogleConfigContainer";
import LocalAuthConfig from "../containers/LocalAuthConfigContainer";
import SSOConfig from "../containers/SSOConfigContainer";

interface Props {
  disabled?: boolean;
  auth: PropTypesOf<typeof FacebookConfig>["auth"] &
    PropTypesOf<typeof FacebookConfig>["authReadOnly"] &
    PropTypesOf<typeof GoogleConfig>["auth"] &
    PropTypesOf<typeof GoogleConfig>["authReadOnly"] &
    PropTypesOf<typeof SSOConfig>["auth"] &
    PropTypesOf<typeof SSOConfig>["authReadOnly"] &
    PropTypesOf<typeof LocalAuthConfig>["auth"];
  onInitValues: (values: any) => void;
}

const AuthIntegrationsConfig: StatelessComponent<Props> = ({
  disabled,
  auth,
  onInitValues,
}) => (
  <HorizontalGutter size="double">
    <Localized id="configure-auth-authIntegrations">
      <Header>Auth Integrations</Header>
    </Localized>
    <LocalAuthConfig
      disabled={disabled}
      auth={auth}
      onInitValues={onInitValues}
    />
    <SSOConfig
      disabled={disabled}
      auth={auth}
      authReadOnly={auth}
      onInitValues={onInitValues}
    />
    <GoogleConfig
      disabled={disabled}
      auth={auth}
      authReadOnly={auth}
      onInitValues={onInitValues}
    />
    <FacebookConfig
      disabled={disabled}
      auth={auth}
      authReadOnly={auth}
      onInitValues={onInitValues}
    />
  </HorizontalGutter>
);

export default AuthIntegrationsConfig;
