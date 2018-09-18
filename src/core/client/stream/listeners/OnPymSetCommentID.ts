import { Child } from "pym.js";
import { Component } from "react";
import { commitLocalUpdate } from "react-relay";
import { Environment } from "relay-runtime";

import { withContext } from "talk-framework/lib/bootstrap";
import { LOCAL_ID } from "talk-framework/lib/relay";

interface Props {
  relayEnvironment: Environment;
  pym: Child;
}

export class OnPymSetCommentID extends Component<Props> {
  constructor(props: Props) {
    super(props);

    // Sets comment id through pym.
    props.pym!.onMessage("setCommentID", raw => {
      commitLocalUpdate(this.props.relayEnvironment, s => {
        const id = raw || null;
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

const enhanced = withContext(({ relayEnvironment, pym }) => ({
  relayEnvironment,
  pym,
}))(OnPymSetCommentID);

export default enhanced;
