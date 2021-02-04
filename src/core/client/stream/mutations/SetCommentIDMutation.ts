import { commitLocalUpdate, Environment } from "relay-runtime";

import { getURLWithCommentID } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation, LOCAL_ID } from "coral-framework/lib/relay";

interface SetCommentIDInput {
  id: string | null;
}

export async function commit(
  environment: Environment,
  input: SetCommentIDInput,
  { pym, window }: CoralContext
) {
  return commitLocalUpdate(environment, (store) => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(input.id, "commentID");
    record.setValue("COMMENTS", "activeTab");

    // Change iframe url, this is important
    // because it is used to cleanly initialized
    // a user session.
    window.history.replaceState(
      window.history.state,
      window.document.title,
      getURLWithCommentID(location.href, input.id || undefined)
    );

    if (pym) {
      // This sets the comment id on the parent url.
      pym.sendMessage("setCommentID", input.id || "");
    }
  });
}

const SetCommentIDMutation = createMutation("setCommentID", commit);

export default SetCommentIDMutation;
