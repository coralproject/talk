import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components/v2";

import FacebookConfigContainer from "./FacebookConfigContainer";
import GoogleConfigContainer from "./GoogleConfigContainer";
import LocalAuthConfig from "./LocalAuthConfig";
import OIDCConfigContainer from "./OIDCConfigContainer";
import SSOConfigContainer from "./SSOConfigContainer";

interface Props {
  disabled?: boolean;
  auth: PropTypesOf<typeof FacebookConfigContainer>["auth"] &
    PropTypesOf<typeof GoogleConfigContainer>["auth"] &
    PropTypesOf<typeof SSOConfigContainer>["auth"] &
    PropTypesOf<typeof OIDCConfigContainer>["auth"];
}

const AuthIntegrationsConfig: FunctionComponent<Props> = ({
  disabled,
  auth,
}) => (
  <HorizontalGutter size="double">
    <LocalAuthConfig disabled={disabled} />
    <OIDCConfigContainer disabled={disabled} auth={auth} />
    <SSOConfigContainer disabled={disabled} auth={auth} />
    <GoogleConfigContainer disabled={disabled} auth={auth} />
    <FacebookConfigContainer disabled={disabled} auth={auth} />
  </HorizontalGutter>
);

export default AuthIntegrationsConfig;
