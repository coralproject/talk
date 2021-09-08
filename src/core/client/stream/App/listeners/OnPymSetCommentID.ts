import { Child } from "pym.js";
import { Component } from "react";
import { commitLocalUpdate } from "react-relay";
import { Environment } from "relay-runtime";

import { getURLWithCommentID } from "coral-framework/helpers";
import { withContext } from "coral-framework/lib/bootstrap";
import { LOCAL_ID } from "coral-framework/lib/relay";

interface Props {
  relayEnvironment: Environment;
  pym: Child;
  window: Window;
}

export class OnPymSetCommentID extends Component<Props> {
  constructor(props: Props) {
    super(props);

    // Sets comment id through pym.
    props.pym.onMessage("setCommentID", (raw) => {
      commitLocalUpdate(this.props.relayEnvironment, (s) => {
        const id = raw || null;
        if (s.get(LOCAL_ID)!.getValue("commentID") !== id) {
          s.get(LOCAL_ID)!.setValue(id, "commentID");

          // Change iframe url, this is important
          // because it is used to cleanly initialized
          // a user session.
          props.window.history.replaceState(
            props.window.history.state,
            props.window.document.title,
            getURLWithCommentID(location.href, id || undefined)
          );
        }
      });
    });
  }

  public render() {
    return null;
  }
}

const enhanced = withContext(({ relayEnvironment, pym, window }) => ({
  relayEnvironment,
  pym,
  window,
}))(OnPymSetCommentID);

export default enhanced;
