import { commitLocalUpdate, Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation, LOCAL_ID } from "coral-framework/lib/relay";

interface SetCommentIDInput {
  id: string | null;
}

export async function commit(
  environment: Environment,
  input: SetCommentIDInput,
  { eventEmitter, window }: CoralContext
) {
  return commitLocalUpdate(environment, (store) => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(input.id, "commentID");
    record.setValue("COMMENTS", "activeTab");

    if (eventEmitter) {
      // This sets the comment id on the parent url.
      eventEmitter.emit("stream.setCommentID", input.id || "");
    }
  });
}

const SetCommentIDMutation = createMutation("setCommentID", commit);

export default SetCommentIDMutation;
