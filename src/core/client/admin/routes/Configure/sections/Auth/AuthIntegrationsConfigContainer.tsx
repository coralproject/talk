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
        ...LocalAuthConfigContainer_auth
        ...OIDCConfigContainer_auth
        ...OIDCConfig_formValues
        ...SSOConfigContainer_auth
        ...SSOConfig_formValues
        ...GoogleConfigContainer_auth
        ...GoogleConfig_formValues
        ...FacebookConfigContainer_auth
        ...FacebookConfig_formValues
      }
    `,
    auth
  );

  return (
    <HorizontalGutter size="double">
      <LocalAuthConfigContainer disabled={disabled} auth={authData} />
      <OIDCConfigContainer disabled={disabled} auth={authData} />
      <SSOConfigContainer disabled={disabled} auth={authData} />
      <GoogleConfigContainer disabled={disabled} auth={authData} />
      <FacebookConfigContainer disabled={disabled} auth={authData} />
    </HorizontalGutter>
  );
};

export default AuthIntegrationsConfigContainer;
