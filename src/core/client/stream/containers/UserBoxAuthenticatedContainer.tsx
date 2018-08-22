import React, { Component } from "react";
import UserBoxAuthenticated from "talk-stream/components/UserBoxAuthenticated";
import { SignOffMutation, withSignOffMutation } from "../../auth/mutations";
import { User } from "../containers/UserBoxContainer";

interface UserBoxAuthenticatedProps {
  signOff: SignOffMutation;
  user: User;
}

class UserBoxAuthenticatedContainer extends Component<
  UserBoxAuthenticatedProps
> {
  private onSignOff = () => {
    this.props.signOff({});
  };
  public render() {
    return (
      <UserBoxAuthenticated onSignOff={this.onSignOff} user={this.props.user} />
    );
  }
}

const enhanced = withSignOffMutation(UserBoxAuthenticatedContainer);
export default enhanced;
