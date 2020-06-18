import { Child } from "pym.js";
import { Component } from "react";

import { withContext } from "coral-framework/lib/bootstrap";
import {
  SignOutMutation,
  withSignOutMutation,
} from "coral-framework/mutations";

interface Props {
  pym: Child;
  signOut: SignOutMutation;
}

export class OnPymLogout extends Component<Props> {
  constructor(props: Props) {
    super(props);

    // Sets comment id through pym.
    props.pym.onMessage("logout", (accessToken) => {
      void this.props.signOut();
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
