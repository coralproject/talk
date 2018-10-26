import React from "react";

import { SignOutMutation, withSignOutMutation } from "talk-framework/mutations";
import { Button } from "talk-ui/components";

interface Props {
  signOut: SignOutMutation;
}

class RedirectAppContainer extends React.Component<Props> {
  private handleClick = () => this.props.signOut();
  public render() {
    return <Button onClick={this.handleClick}>Sign Out</Button>;
  }
}

const enhanced = withSignOutMutation(RedirectAppContainer);

export default enhanced;
