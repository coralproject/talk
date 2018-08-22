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

import UserBoxUnauthenticated from "talk-stream/components/UserBoxUnauthenticated";
import UserBoxAuthenticatedContainer from "../containers/UserBoxAuthenticatedContainer";

export type USER_ROLE =
  | "ADMIN"
  | "COMMENTER"
  | "MODERATOR"
  | "STAFF"
  | "%future added value";

export interface User {
  id?: string;
  username?: string | null;
  displayName?: string | null;
  role?: USER_ROLE;
}

interface InnerProps {
  local: Local;
  user: User | null | undefined;
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
      user,
    } = this.props;

    if (user) {
      return <UserBoxAuthenticatedContainer user={user} />;
    }

    return (
      <>
        <Popup
          href={`/auth.html?view=${view}`}
          title="Talk Auth"
          features="menubar=0,resizable=0,width=350,height=720,top=200,left=500"
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

// TODO: (bc) Add fragment here if composing is doable.
export default enhanced;
