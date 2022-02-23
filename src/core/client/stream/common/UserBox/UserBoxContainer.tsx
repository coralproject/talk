import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  MutationProp,
  useLocal,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { SignOutMutation } from "coral-stream/mutations";

import { UserBoxContainer_settings$data as SettingsData } from "coral-stream/__generated__/UserBoxContainer_settings.graphql";
import { UserBoxContainer_viewer$data as ViewerData } from "coral-stream/__generated__/UserBoxContainer_viewer.graphql";
import { UserBoxContainerLocal$data as UserBoxContainerLocal } from "coral-stream/__generated__/UserBoxContainerLocal.graphql";

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
  const signOut = useMutation(SignOutMutation);
  const handleSignIn = () => showAuthPopup({ view: "SIGN_IN" });
  const handleRegister = () => showAuthPopup({ view: "SIGN_UP" });
  const handleSignOut = () => signOut();
  const supportsLogout = Boolean(
    !accessToken || (accessTokenJTI !== null && accessTokenExp !== null)
  );

  if (viewer) {
    return (
      <UserBoxAuthenticated
        onSignOut={handleSignOut}
        username={viewer.username!}
        showLogoutButton={supportsLogout}
      />
    );
  }

  if (!weControlAuth(settings)) {
    return null;
  }

  return (
    <>
      <AuthPopup />
      <UserBoxUnauthenticated
        onSignIn={handleSignIn}
        onRegister={(supportsRegister(settings) && handleRegister) || undefined}
        showRegisterButton={supportsRegister(settings)}
      />
    </>
  );
};

const enhanced = withShowAuthPopupMutation(
  withFragmentContainer<Props>({
    viewer: graphql`
      fragment UserBoxContainer_viewer on User {
        username
      }
    `,
    settings: graphql`
      fragment UserBoxContainer_settings on Settings {
        ...authControl_settings @relay(mask: false)
      }
    `,
  })(UserBoxContainer)
);

export default enhanced;
