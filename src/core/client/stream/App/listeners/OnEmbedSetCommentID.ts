import { Component } from "react";
import { commitLocalUpdate } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext, withContext } from "coral-framework/lib/bootstrap";
import { LOCAL_ID } from "coral-framework/lib/relay";

interface Props {
  relayEnvironment: Environment;
  eventEmitter: CoralContext["eventEmitter"];
  window: Window;
}

export class OnEmbedSetCommentID extends Component<Props> {
  constructor(props: Props) {
    super(props);

    props.eventEmitter.on("embed.setCommentID", (value: string) => {
      commitLocalUpdate(this.props.relayEnvironment, (s) => {
        const id = value || null;
        if (s.get(LOCAL_ID)!.getValue("commentID") !== id) {
          s.get(LOCAL_ID)!.setValue(id, "commentID");
        }
      });
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ relayEnvironment, eventEmitter, window }) => ({
  relayEnvironment,
  eventEmitter,
  window,
}))(OnEmbedSetCommentID);

export default enhanced;
