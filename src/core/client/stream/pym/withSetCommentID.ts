import { commitLocalUpdate } from "react-relay";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { LOCAL_ID } from "talk-framework/lib/relay";

export default function withSetCommentID({
  relayEnvironment,
  pym,
}: TalkContext) {
  // Sets comment id through pym.
  pym!.onMessage("setCommentID", raw => {
    commitLocalUpdate(relayEnvironment, s => {
      const id = raw || null;
      if (s.get(LOCAL_ID)!.getValue("commentID") !== id) {
        s.get(LOCAL_ID)!.setValue(id, "commentID");
      }
    });
  });
}
