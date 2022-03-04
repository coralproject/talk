import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components/v2";

import FacebookConfigContainer from "./FacebookConfigContainer";
import GoogleConfigContainer from "./GoogleConfigContainer";
import LocalAuthConfigContainer from "./LocalAuthConfigContainer";
import OIDCConfigContainer from "./OIDCConfigContainer";
import SSOConfigContainer from "./SSOConfigContainer";

interface Props {
  disabled?: boolean;
  auth: PropTypesOf<typeof FacebookConfigContainer>["auth"] &
    PropTypesOf<typeof GoogleConfigContainer>["auth"] &
    PropTypesOf<typeof OIDCConfigContainer>["auth"];
}

const AuthIntegrationsConfig: FunctionComponent<Props> = ({
  disabled,
  auth,
}) => (
  <HorizontalGutter size="double">
    <LocalAuthConfigContainer disabled={disabled} />
    <OIDCConfigContainer disabled={disabled} auth={auth} />
    <SSOConfigContainer disabled={disabled} />
    <GoogleConfigContainer disabled={disabled} auth={auth} />
    <FacebookConfigContainer disabled={disabled} auth={auth} />
  </HorizontalGutter>
);

export default AuthIntegrationsConfig;
