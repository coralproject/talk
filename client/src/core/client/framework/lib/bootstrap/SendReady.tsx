import { EventEmitter2 } from "eventemitter2";
import React from "react";

import withContext from "./withContext";

interface Props {
  eventEmitter: EventEmitter2;
}

/**
 * SendReady will notify the embed that
 * we are ready and have setup all listeners.
 */
class SendReady extends React.Component<Props> {
  private sent = false;

  public componentDidMount() {
    if (!this.sent) {
      this.sent = true;
      this.props.eventEmitter.emit("ready", "");
    }
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ eventEmitter }) => ({ eventEmitter }))(
  SendReady
);
export default enhanced;
