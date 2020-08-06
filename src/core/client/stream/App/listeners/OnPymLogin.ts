import { Child } from "pym.js";
import { Component } from "react";

import { withContext } from "coral-framework/lib/bootstrap";
import { MutationProp, withMutation } from "coral-framework/lib/relay";
import { SetAccessTokenMutation } from "coral-framework/mutations";

interface Props {
  pym: Child;
  setAccessToken: MutationProp<typeof SetAccessTokenMutation>;
}

export class OnPymLogin extends Component<Props> {
  constructor(props: Props) {
    super(props);

    // Sets comment id through pym.
    props.pym.onMessage("login", (accessToken) => {
      void this.props.setAccessToken({ accessToken, ephemeral: true });
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
