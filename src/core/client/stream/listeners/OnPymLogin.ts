import { Child } from "pym.js";
import { Component } from "react";
import {
  SetAccessTokenMutation,
  withSetAccessTokenMutation,
} from "talk-framework/mutations";

import { withContext } from "talk-framework/lib/bootstrap";

interface Props {
  pym: Child;
  setAccessToken: SetAccessTokenMutation;
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
}))(withSetAccessTokenMutation(OnPymLogin));

export default enhanced;
