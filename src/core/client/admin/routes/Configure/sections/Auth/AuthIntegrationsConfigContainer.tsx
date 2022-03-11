import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { HorizontalGutter } from "coral-ui/components/v2";

import { AuthIntegrationsConfigContainer_auth$key } from "coral-admin/__generated__/AuthIntegrationsConfigContainer_auth.graphql";

import FacebookConfigContainer from "./FacebookConfigContainer";
import GoogleConfigContainer from "./GoogleConfigContainer";
import LocalAuthConfigContainer from "./LocalAuthConfigContainer";
import OIDCConfigContainer from "./OIDCConfigContainer";
import SSOConfigContainer from "./SSOConfigContainer";

interface Props {
  disabled?: boolean;
  auth: AuthIntegrationsConfigContainer_auth$key;
}

const AuthIntegrationsConfigContainer: FunctionComponent<Props> = ({
  disabled,
  auth,
}) => {
  const authData = useFragment(
    graphql`
      fragment AuthIntegrationsConfigContainer_auth on Auth {
        ...FacebookConfig_formValues @relay(mask: false)
        ...GoogleConfig_formValues @relay(mask: false)
        ...LocalAuthConfigContainer_formValues @relay(mask: false)
        ...OIDCConfig_formValues @relay(mask: false)
        ...SessionConfig_formValues @relay(mask: false)

        ...FacebookConfigContainer_auth
        ...GoogleConfigContainer_auth
        ...OIDCConfigContainer_auth
      }
    `,
    auth
  );

  return (
    <HorizontalGutter size="double">
      <LocalAuthConfigContainer disabled={disabled} />
      <OIDCConfigContainer disabled={disabled} auth={authData} />
      <SSOConfigContainer disabled={disabled} />
      <GoogleConfigContainer disabled={disabled} auth={authData} />
      <FacebookConfigContainer disabled={disabled} auth={authData} />
    </HorizontalGutter>
  );
};

export default AuthIntegrationsConfigContainer;
