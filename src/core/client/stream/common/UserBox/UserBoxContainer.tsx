import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { MutationProp, useLocal, useMutation } from "coral-framework/lib/relay";
import { SignOutMutation } from "coral-stream/mutations";

import { UserBoxContainer_settings$key as SettingsData } from "coral-stream/__generated__/UserBoxContainer_settings.graphql";
import { UserBoxContainer_viewer$key as ViewerData } from "coral-stream/__generated__/UserBoxContainer_viewer.graphql";
import { UserBoxContainerLocal } from "coral-stream/__generated__/UserBoxContainerLocal.graphql";

import { supportsRegister, weControlAuth } from "../authControl";
import AuthPopup, {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "../AuthPopup";
import UserBoxAuthenticated from "./UserBoxAuthenticated";
import UserBoxUnauthenticated from "./UserBoxUnauthenticated";

interface Props {
  viewer: ViewerData | null;
  settings: SettingsData;
  showAuthPopup: MutationProp<typeof ShowAuthPopupMutation>;
}

export const UserBoxContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
  showAuthPopup,
}) => {
  const [{ accessToken, accessTokenJTI, accessTokenExp }] = useLocal<
    UserBoxContainerLocal
  >(graphql`
    fragment UserBoxContainerLocal on Local {
      accessToken
      accessTokenJTI
      accessTokenExp
    }
  `);
  const viewerData = useFragment(
    graphql`
      fragment UserBoxContainer_viewer on User {
        username
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment UserBoxContainer_settings on Settings {
        ...authControl_settings @relay(mask: false)
      }
    `,
    settings
  );
  const signOut = useMutation(SignOutMutation);
  const handleSignIn = () => showAuthPopup({ view: "SIGN_IN" });
  const handleRegister = () => showAuthPopup({ view: "SIGN_UP" });
  const handleSignOut = () => signOut();
  const supportsLogout = Boolean(
    !accessToken || (accessTokenJTI !== null && accessTokenExp !== null)
  );

  if (viewerData) {
    return (
      <UserBoxAuthenticated
        onSignOut={handleSignOut}
        username={viewerData.username ?? ""}
        showLogoutButton={supportsLogout}
      />
    );
  }

  if (!weControlAuth(settingsData)) {
    return null;
  }

  return (
    <>
      <AuthPopup />
      <UserBoxUnauthenticated
        onSignIn={handleSignIn}
        onRegister={
          (supportsRegister(settingsData) && handleRegister) || undefined
        }
        showRegisterButton={supportsRegister(settingsData)}
      />
    </>
  );
};

const enhanced = withShowAuthPopupMutation(UserBoxContainer);

export default enhanced;
