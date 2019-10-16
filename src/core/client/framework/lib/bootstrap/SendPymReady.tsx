import { Child } from "pym.js";
import React from "react";

import withContext from "./withContext";

interface Props {
  pym: Child;
}

/**
 * SendPymReady will notify the parent pym that
 * we are ready and have setup all listeners.
 */
class SendPymReady extends React.Component<Props> {
  private sent = false;

  public componentDidMount() {
    if (!this.sent) {
      this.sent = true;
      this.props.pym.sendMessage("ready", "");
    }
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ pym }) => ({ pym }))(SendPymReady);
export default enhanced;
