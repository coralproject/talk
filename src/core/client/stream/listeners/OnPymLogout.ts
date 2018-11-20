import { Child } from "pym.js";
import { Component } from "react";
import { SignOutMutation, withSignOutMutation } from "talk-framework/mutations";

import { withContext } from "talk-framework/lib/bootstrap";

interface Props {
  pym: Child;
  signOut: SignOutMutation;
}

export class OnPymLogout extends Component<Props> {
  constructor(props: Props) {
    super(props);

    // Sets comment id through pym.
    props.pym!.onMessage("logout", authToken => {
      this.props.signOut();
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ pym }) => ({
  pym,
}))(withSignOutMutation(OnPymLogout));

export default enhanced;
