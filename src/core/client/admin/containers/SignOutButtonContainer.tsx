import React from "react";

import { SignOutMutation, withSignOutMutation } from "talk-framework/mutations";
import SignOutButton from "../components/SignOutButton";

interface Props {
  signOut: SignOutMutation;
  id?: string;
}

class RedirectAppContainer extends React.Component<Props> {
  private handleClick = () => this.props.signOut();
  public render() {
    return <SignOutButton id={this.props.id} onClick={this.handleClick} />;
  }
}

const enhanced = withSignOutMutation(RedirectAppContainer);

export default enhanced;
