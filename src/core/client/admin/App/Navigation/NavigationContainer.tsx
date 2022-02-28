import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { Ability, can } from "coral-admin/permissions";
import {
  SignOutMutation,
  withSignOutMutation,
} from "coral-framework/mutations";

import { NavigationContainer_viewer$key as ViewerData } from "coral-admin/__generated__/NavigationContainer_viewer.graphql";

import Navigation from "./Navigation";

interface Props {
  signOut: SignOutMutation;
  viewer: ViewerData | null;
}

const NavigationContainer: FunctionComponent<Props> = ({ signOut, viewer }) => {
  const viewerData = useFragment(
    graphql`
      fragment NavigationContainer_viewer on User {
        role
      }
    `,
    viewer
  );

  return (
    <Navigation
      showDashboard={!!viewerData && can(viewerData, Ability.VIEW_STATISTICS)}
      showConfigure={
        !!viewerData && can(viewerData, Ability.CHANGE_CONFIGURATION)
      }
    />
  );
};

const enhanced = withSignOutMutation(NavigationContainer);

export default enhanced;
