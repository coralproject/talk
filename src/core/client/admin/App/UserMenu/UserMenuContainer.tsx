import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import {
  SignOutMutation,
  withSignOutMutation,
} from "coral-framework/mutations";

import { UserMenuContainer_viewer$key as ViewerData } from "coral-admin/__generated__/UserMenuContainer_viewer.graphql";

import UserMenu from "./UserMenu";

interface Props {
  signOut: SignOutMutation;
  viewer: ViewerData | null;
}

const UserMenuContainer: FunctionComponent<Props> = ({ signOut, viewer }) => {
  const viewerData = useFragment(
    graphql`
      fragment UserMenuContainer_viewer on User {
        username
      }
    `,
    viewer
  );
  const handleSignOut = useCallback(() => signOut(), [signOut]);
  return (
    <UserMenu
      onSignOut={handleSignOut}
      username={(viewerData && viewerData.username) || ""}
    />
  );
};

const enhanced = withSignOutMutation(UserMenuContainer);

export default enhanced;
