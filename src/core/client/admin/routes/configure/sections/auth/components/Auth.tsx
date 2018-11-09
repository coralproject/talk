import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { HorizontalGutter } from "talk-ui/components";

import Header from "../../../components/Header";
import FacebookConfig from "../containers/FacebookConfigContainer";
import GoogleConfig from "../containers/GoogleConfigContainer";

interface Props {
  disabled?: boolean;
  auth: PropTypesOf<typeof FacebookConfig>["auth"] &
    PropTypesOf<typeof FacebookConfig>["authReadOnly"] &
    PropTypesOf<typeof GoogleConfig>["auth"] &
    PropTypesOf<typeof GoogleConfig>["authReadOnly"];
  onInitValues: (values: any) => void;
}

const Auth: StatelessComponent<Props> = ({ disabled, auth, onInitValues }) => (
  <div>
    <Localized id="configure-auth-authIntegrations">
      <Header>Auth Integrations</Header>
    </Localized>
    <HorizontalGutter size="double">
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
  </div>
);

export default Auth;
