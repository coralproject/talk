import React, { Component } from "react";

import { urls } from "coral-framework/helpers";
import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import {
  SignOutMutation,
  withSignOutMutation,
} from "coral-framework/mutations";
import { UserBoxContainer_settings as SettingsData } from "coral-stream/__generated__/UserBoxContainer_settings.graphql";
import { UserBoxContainer_viewer as ViewerData } from "coral-stream/__generated__/UserBoxContainer_viewer.graphql";
import { UserBoxContainerLocal as Local } from "coral-stream/__generated__/UserBoxContainerLocal.graphql";
import {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "coral-stream/mutations";
import { Popup } from "coral-ui/components";

import {
  SetAuthPopupStateMutation,
  withSetAuthPopupStateMutation,
} from "./SetAuthPopupStateMutation";
import UserBoxAuthenticated from "./UserBoxAuthenticated";
import UserBoxUnauthenticated from "./UserBoxUnauthenticated";

interface Props {
  local: Local;
  viewer: ViewerData | null;
  settings: SettingsData;
  showAuthPopup: ShowAuthPopupMutation;
  setAuthPopupState: SetAuthPopupStateMutation;
  signOut: SignOutMutation;
}

export class UserBoxContainer extends Component<Props> {
  private handleFocus = () => this.props.setAuthPopupState({ focus: true });
  private handleBlur = () => this.props.setAuthPopupState({ focus: false });
  private handleClose = () => this.props.setAuthPopupState({ open: false });
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

  private get supportsRegister() {
    const integrations = this.props.settings.auth.integrations;
    return [
      integrations.facebook,
      integrations.google,
      integrations.local,
      integrations.oidc,
    ].some(i => i.allowRegistration && i.enabled && i.targetFilter.stream);
  }

  private get weControlAuth() {
    const integrations = this.props.settings.auth.integrations;
    return [
      integrations.facebook,
      integrations.google,
      integrations.local,
      integrations.oidc,
    ].some(i => i.enabled && i.targetFilter.stream);
  }

  private get authUrl(): any {
    const {
      facebook,
      google,
      local,
      oidc,
    } = this.props.settings.auth.integrations;

    const defaultAuthUrl = `${urls.embed.auth}?view=${
      this.props.local.authPopup.view
    }`;

    if (local.enabled) {
      return defaultAuthUrl;
    }

    const onlyFacebookIntegration =
      facebook.enabled && !google.enabled && !oidc.enabled;
    const onlyGoogleIntegration =
      !facebook.enabled && google.enabled && !oidc.enabled;
    const onlyOidcIntegration =
      !facebook.enabled && !google.enabled && oidc.enabled;

    if (onlyFacebookIntegration) {
      return facebook.redirectURL;
    }

    if (onlyGoogleIntegration) {
      return google.redirectURL;
    }

    if (onlyOidcIntegration) {
      return oidc.redirectURL;
    }
    return defaultAuthUrl;
  }

  public render() {
    const {
      local: {
        authPopup: { open, focus },
      },
      viewer,
    } = this.props;

    if (viewer) {
      return (
        <UserBoxAuthenticated
          onSignOut={this.handleSignOut}
          username={viewer.username!}
          showLogoutButton={this.supportsLogout}
        />
      );
    }

    if (!this.weControlAuth) {
      return null;
    }

    return (
      <>
        <Popup
          href={this.authUrl}
          title="Coral Auth"
          features="menubar=0,resizable=0,width=350,height=450,top=100,left=500"
          open={open}
          focus={focus}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onClose={this.handleClose}
        />
        <UserBoxUnauthenticated
          onSignIn={this.handleSignIn}
          onRegister={
            (this.supportsRegister && this.handleRegister) || undefined
          }
          showRegisterButton={this.supportsRegister}
        />
      </>
    );
  }
}

const enhanced = withSignOutMutation(
  withSetAuthPopupStateMutation(
    withShowAuthPopupMutation(
      withLocalStateContainer(
        graphql`
          fragment UserBoxContainerLocal on Local {
            authPopup {
              open
              focus
              view
            }
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
              auth {
                integrations {
                  local {
                    enabled
                    allowRegistration
                    targetFilter {
                      stream
                    }
                  }
                  oidc {
                    enabled
                    allowRegistration
                    redirectURL
                    targetFilter {
                      stream
                    }
                  }
                  google {
                    enabled
                    allowRegistration
                    redirectURL
                    targetFilter {
                      stream
                    }
                  }
                  facebook {
                    enabled
                    allowRegistration
                    redirectURL
                    targetFilter {
                      stream
                    }
                  }
                }
              }
            }
          `,
        })(UserBoxContainer)
      )
    )
  )
);

export default enhanced;
