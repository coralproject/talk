import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { Ability, can } from "coral-admin/permissions/tenant";
import { GQLUSER_ROLE } from "coral-common/client/src/core/client/framework/schema/__generated__/types";
import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import {
  SignOutMutation,
  withSignOutMutation,
} from "coral-framework/mutations";

import { NavigationContainer_settings as SettingsData } from "coral-admin/__generated__/NavigationContainer_settings.graphql";
import { NavigationContainer_viewer as ViewerData } from "coral-admin/__generated__/NavigationContainer_viewer.graphql";
import { NavigationContainerLocal } from "coral-admin/__generated__/NavigationContainerLocal.graphql";

import Navigation from "./Navigation";

interface Props {
  signOut: SignOutMutation;
  viewer: ViewerData | null;
  settings: SettingsData | null;
}

const NavigationContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
}) => {
  const [{ dsaFeaturesEnabled }] = useLocal<NavigationContainerLocal>(
    graphql`
      fragment NavigationContainerLocal on Local {
        dsaFeaturesEnabled
      }
    `
  );
  return (
    <Navigation
      showDashboard={!!viewer && can(viewer, Ability.VIEW_STATISTICS)}
      showConfigure={!!viewer && can(viewer, Ability.CHANGE_CONFIGURATION)}
      showReports={
        !!dsaFeaturesEnabled &&
        !!viewer &&
        can(viewer, Ability.MODERATE_DSA_REPORTS) &&
        // Exclude single-site moderators
        !(
          settings?.multisite &&
          viewer.role === GQLUSER_ROLE.MODERATOR &&
          viewer.moderationScopes &&
          viewer.moderationScopes.sites &&
          viewer.moderationScopes.sites.length === 1
        )
      }
    />
  );
};

const enhanced = withSignOutMutation(
  withFragmentContainer<Props>({
    viewer: graphql`
      fragment NavigationContainer_viewer on User {
        role
        moderationScopes {
          sites {
            id
          }
        }
      }
    `,
    settings: graphql`
      fragment NavigationContainer_settings on Settings {
        multisite
      }
    `,
  })(NavigationContainer)
);

export default enhanced;
