import { commitLocalUpdate, Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { LOCAL_ID } from "talk-framework/lib/relay/withLocalStateContainer";

export interface SetCommentIDInput {
  id: string | null;
}

export type SetCommentIDMutation = (input: SetCommentIDInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetCommentIDInput,
  { pym }: TalkContext
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(input.id, "commentID");
    if (pym) {
      // This sets the comment id on the parent url.
      pym.sendMessage("setCommentID", input.id || "");
    }
  });
}

export const withSetCommentIDMutation = createMutationContainer(
  "setCommentID",
  commit
);
