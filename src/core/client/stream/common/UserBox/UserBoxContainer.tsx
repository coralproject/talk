import React, { Component } from "react";
import { graphql } from "react-relay";

import {
  MutationProp,
  withFragmentContainer,
  withLocalStateContainer,
  withMutation,
} from "coral-framework/lib/relay";
import { SignOutMutation } from "coral-stream/mutations";

import { UserBoxContainer_settings$data as SettingsData } from "coral-stream/__generated__/UserBoxContainer_settings.graphql";
import { UserBoxContainer_viewer$data as ViewerData } from "coral-stream/__generated__/UserBoxContainer_viewer.graphql";
import { UserBoxContainerLocal as Local } from "coral-stream/__generated__/UserBoxContainerLocal.graphql";

import { supportsRegister, weControlAuth } from "../authControl";
import AuthPopup, {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "../AuthPopup";
import UserBoxAuthenticated from "./UserBoxAuthenticated";
import UserBoxUnauthenticated from "./UserBoxUnauthenticated";

interface Props {
  local: Local;
  viewer: ViewerData | null;
  settings: SettingsData;
  showAuthPopup: MutationProp<typeof ShowAuthPopupMutation>;
  signOut: MutationProp<typeof SignOutMutation>;
}

interface State {
  showLogout: boolean;
}

export class UserBoxContainer extends Component<Props, State> {
  private handleSignIn = () => this.props.showAuthPopup({ view: "SIGN_IN" });
  private handleRegister = () => this.props.showAuthPopup({ view: "SIGN_UP" });
  private handleSignOut = () => this.props.signOut();

  private get supportsLogout() {
    return Boolean(
      !this.props.local.accessToken ||
        (this.props.local.accessTokenJTI !== null &&
          this.props.local.accessTokenExp !== null)
    );
  }

  public render() {
    const { viewer } = this.props;

    if (viewer) {
      return (
        <UserBoxAuthenticated
          onSignOut={this.handleSignOut}
          username={viewer.username!}
          showLogoutButton={this.supportsLogout}
        />
      );
    }

    if (!weControlAuth(this.props.settings)) {
      return null;
    }

    return (
      <>
        <AuthPopup />
        <UserBoxUnauthenticated
          onSignIn={this.handleSignIn}
          onRegister={
            (supportsRegister(this.props.settings) && this.handleRegister) ||
            undefined
          }
          showRegisterButton={supportsRegister(this.props.settings)}
        />
      </>
    );
  }
}

const enhanced = withMutation(SignOutMutation)(
  withShowAuthPopupMutation(
    withLocalStateContainer(
      graphql`
        fragment UserBoxContainerLocal on Local {
          accessToken
          accessTokenJTI
          accessTokenExp
        }
      `
    )(
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
    )
  )
);

export default enhanced;
