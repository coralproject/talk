import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";
import { HorizontalGutter } from "coral-ui/components/v2";

import { AuthIntegrationsConfigContainer_settings } from "coral-admin/__generated__/AuthIntegrationsConfigContainer_settings.graphql";

import FacebookConfigContainer from "./FacebookConfigContainer";
import GoogleConfigContainer from "./GoogleConfigContainer";
import LocalAuthConfigContainer from "./LocalAuthConfigContainer";
import OIDCConfigContainer from "./OIDCConfigContainer";
import SSOConfigContainer from "./SSOConfigContainer";

interface Props {
  disabled?: boolean;
  auth: PropTypesOf<typeof FacebookConfigContainer>["auth"] &
    PropTypesOf<typeof GoogleConfigContainer>["auth"] &
    PropTypesOf<typeof SSOConfigContainer>["auth"] &
    PropTypesOf<typeof OIDCConfigContainer>["auth"];
  settings: AuthIntegrationsConfigContainer_settings;
}

const AuthIntegrationsConfigContainer: FunctionComponent<Props> = ({
  disabled,
  auth,
  settings,
}) => (
  <HorizontalGutter size="double">
    <LocalAuthConfigContainer disabled={disabled} settings={settings} />
    <OIDCConfigContainer disabled={disabled} auth={auth} />
    <SSOConfigContainer disabled={disabled} auth={auth} />
    <GoogleConfigContainer disabled={disabled} auth={auth} />
    <FacebookConfigContainer disabled={disabled} auth={auth} />
  </HorizontalGutter>
);

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment AuthIntegrationsConfigContainer_settings on Settings {
      ...LocalAuthConfigContainer_settings
    }
  `,
})(AuthIntegrationsConfigContainer);

export default enhanced;
