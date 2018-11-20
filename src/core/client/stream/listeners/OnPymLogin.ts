import { Child } from "pym.js";
import { Component } from "react";
import {
  SetAuthTokenMutation,
  withSetAuthTokenMutation,
} from "talk-framework/mutations";

import { withContext } from "talk-framework/lib/bootstrap";

interface Props {
  pym: Child;
  setAuthToken: SetAuthTokenMutation;
}

export class OnPymLogin extends Component<Props> {
  constructor(props: Props) {
    super(props);

    // Sets comment id through pym.
    props.pym!.onMessage("login", authToken => {
      this.props.setAuthToken({ authToken });
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ pym }) => ({
  pym,
}))(withSetAuthTokenMutation(OnPymLogin));

export default enhanced;
