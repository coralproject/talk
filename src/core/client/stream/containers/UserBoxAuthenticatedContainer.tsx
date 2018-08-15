import React, { Component } from "react";
import UserBoxUnauthenticated from "talk-stream/components/UserBoxUnauthenticated";
import { withSignOffMutation } from "../../auth/mutations";

interface SignInContainerProps {
  onSignIn: () => void;
  onRegister: () => void;
  signOff: () => void;
}

export type View = "SIGN_UP" | "FORGOT_PASSWORD";

class UserBoxUnauthenticatedContainer extends Component<SignInContainerProps> {
  private signOff = () => {
    this.props.signOff();
  };
  public render() {
    return (
      <UserBoxUnauthenticated
        onSignOff={this.signOff}
        onRegister={this.props.onRegister}
        onSignIn={this.props.onSignIn}
      />
    );
  }
}

const enhanced = withSignOffMutation(UserBoxUnauthenticatedContainer);
export default enhanced;
