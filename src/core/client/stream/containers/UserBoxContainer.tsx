import * as React from "react";
import { Component } from "react";

import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { SignOutMutation, withSignOutMutation } from "talk-framework/mutations";
import { UserBoxContainer_me as MeData } from "talk-stream/__generated__/UserBoxContainer_me.graphql";
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

interface InnerProps {
  local: Local;
  me: MeData | null;
  showAuthPopup: ShowAuthPopupMutation;
  setAuthPopupState: SetAuthPopupStateMutation;
  signOut: SignOutMutation;
}

export class UserBoxContainer extends Component<InnerProps> {
  private handleFocus = () => this.props.setAuthPopupState({ focus: true });
  private handleBlur = () => this.props.setAuthPopupState({ focus: false });
  private handleClose = () => this.props.setAuthPopupState({ open: false });
  private handleSignIn = () => this.props.showAuthPopup({ view: "SIGN_IN" });
  private handleRegister = () => this.props.showAuthPopup({ view: "SIGN_UP" });
  private handleSignOut = () => this.props.signOut();

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
          // TODO: why nullable?
          username={me.username!}
        />
      );
    }

    return (
      <>
        <Popup
          href={`${urls.embed.auth}?view=${view}`}
          title="Talk Auth"
          features="menubar=0,resizable=0,width=350,height=395,top=200,left=500"
          open={open}
          focus={focus}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onClose={this.handleClose}
        />
        <UserBoxUnauthenticated
          onSignIn={this.handleSignIn}
          onRegister={this.handleRegister}
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
          }
        `
      )(
        withFragmentContainer<InnerProps>({
          me: graphql`
            fragment UserBoxContainer_me on User {
              username
            }
          `,
        })(UserBoxContainer)
      )
    )
  )
);

export default enhanced;
