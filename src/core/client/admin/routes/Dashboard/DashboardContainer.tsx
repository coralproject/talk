import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { DashboardContainer_settings } from "coral-admin/__generated__/DashboardContainer_settings.graphql";

import Dashboard from "./Dashboard";

interface Props {
  settings: DashboardContainer_settings;
  siteID?: string;
}

const DashboardContainer: FunctionComponent<Props> = ({ settings, siteID }) => {
  return (
    <Dashboard
      siteID={siteID}
      ssoRegistrationEnabled={
        settings.auth.integrations.sso.enabled &&
        settings.auth.integrations.sso.allowRegistration
      }
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment DashboardContainer_settings on Settings {
      multisite
      auth {
        integrations {
          sso {
            enabled
            allowRegistration
          }
        }
      }
    }
  `,
})(DashboardContainer);

export default enhanced;
