import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { Ability, can } from "coral-admin/permissions/tenant";
import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import {
  SignOutMutation,
  withSignOutMutation,
} from "coral-framework/mutations";

import { NavigationContainer_viewer as ViewerData } from "coral-admin/__generated__/NavigationContainer_viewer.graphql";
import { NavigationContainerLocal } from "coral-admin/__generated__/NavigationContainerLocal.graphql";

import Navigation from "./Navigation";

interface Props {
  signOut: SignOutMutation;
  viewer: ViewerData | null;
}

const NavigationContainer: FunctionComponent<Props> = ({ viewer }) => {
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
      showReports={!!dsaFeaturesEnabled}
    />
  );
};

const enhanced = withSignOutMutation(
  withFragmentContainer<Props>({
    viewer: graphql`
      fragment NavigationContainer_viewer on User {
        role
      }
    `,
  })(NavigationContainer)
);

export default enhanced;
