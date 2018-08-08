import * as React from "react";
import { Component } from "react";

import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";
import { UserBoxContainerLocal as Local } from "talk-stream/__generated__/UserBoxContainerLocal.graphql";
import {
  SetAuthPopupStateMutation,
  ShowAuthPopupMutation,
  withSetAuthPopupStateMutation,
  withShowAuthPopupMutation,
} from "talk-stream/mutations";
import { Popup } from "talk-ui/components";

import UserBoxUnauthenticated from "../components/UserBoxUnauthenticated";

interface InnerProps {
  local: Local;
  showAuthPopup: ShowAuthPopupMutation;
  setAuthPopupState: SetAuthPopupStateMutation;
}

export class UserBoxContainer extends Component<InnerProps> {
  private handleFocus = () => this.props.setAuthPopupState({ focus: true });
  private handleBlur = () => this.props.setAuthPopupState({ focus: false });
  private handleClose = () => this.props.setAuthPopupState({ open: false });
  private handleSignIn = () => this.props.showAuthPopup({ view: "SIGN_IN" });
  private handleRegister = () => this.props.showAuthPopup({ view: "SIGN_UP" });

  public render() {
    const {
      local: {
        authPopup: { open, focus, view },
      },
    } = this.props;
    return (
      <>
        <Popup
          href={`/auth.html?view=${view}`}
          title="Talk Auth"
          features="menubar=0,resizable=0,width=500,height=550,top=200,left=500"
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

const enhanced = withSetAuthPopupStateMutation(
  withShowAuthPopupMutation(
    withLocalStateContainer<Local>(
      graphql`
        fragment UserBoxContainerLocal on Local {
          authPopup {
            open
            focus
            view
          }
        }
      `
    )(UserBoxContainer)
  )
);

export default enhanced;
