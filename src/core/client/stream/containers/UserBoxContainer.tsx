import * as React from "react";
import { Component } from "react";

import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { SignOutMutation, withSignOutMutation } from "talk-framework/mutations";
import { UserBoxContainer_me as MeData } from "talk-stream/__generated__/UserBoxContainer_me.graphql";
import { UserBoxContainer_settings as SettingsData } from "talk-stream/__generated__/UserBoxContainer_settings.graphql";
import { UserBoxContainerLocal as Local } from "talk-stream/__generated__/UserBoxContainerLocal.graphql";
import UserBoxUnauthenticated from "talk-stream/components/UserBoxUnauthenticated";
import {
  SetAuthPopupStateMutation,
  ShowAuthPopupMutation,
  withSetAuthPopupStateMutation,
  withShowAuthPopupMutation,
} from "talk-stream/mutations";
import { Popup } from "talk-ui/components";

import { urls } from "talk-framework/helpers";
import UserBoxAuthenticated from "../components/UserBoxAuthenticated";

interface Props {
  local: Local;
  me: MeData | null;
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
    return !!this.props.local.accessTokenJTI;
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

  public render() {
    const {
      local: {
        authPopup: { open, focus, view },
      },
      me,
    } = this.props;

    if (me) {
      return (
        <UserBoxAuthenticated
          onSignOut={this.handleSignOut}
          username={me.username!}
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
          href={`${urls.embed.auth}?view=${view}`}
          title="Talk Auth"
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
            accessTokenJTI
          }
        `
      )(
        withFragmentContainer<Props>({
          me: graphql`
            fragment UserBoxContainer_me on User {
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
                    targetFilter {
                      stream
                    }
                  }
                  google {
                    enabled
                    allowRegistration
                    targetFilter {
                      stream
                    }
                  }
                  facebook {
                    enabled
                    allowRegistration
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
