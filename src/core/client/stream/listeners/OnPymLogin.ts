import { Child } from "pym.js";
import { Component } from "react";

import { withContext } from "talk-framework/lib/bootstrap";
import { MutationProp, withMutation } from "talk-framework/lib/relay";
import { SetAccessTokenMutation } from "talk-framework/mutations";

interface Props {
  pym: Child;
  setAccessToken: MutationProp<typeof SetAccessTokenMutation>;
}

export class OnPymLogin extends Component<Props> {
  constructor(props: Props) {
    super(props);

    // Sets comment id through pym.
    props.pym!.onMessage("login", accessToken => {
      this.props.setAccessToken({ accessToken });
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ pym }) => ({
  pym,
}))(withMutation(SetAccessTokenMutation)(OnPymLogin));

export default enhanced;
