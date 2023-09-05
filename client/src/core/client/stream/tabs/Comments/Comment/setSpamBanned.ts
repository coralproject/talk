import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutation } from "coral-framework/lib/relay";

export interface Input {
  commentID: string;
  spamBanned: boolean;
}

export async function commit(environment: Environment, input: Input) {
  return commitLocalUpdate(environment, (store) => {
    const comment = store.get(input.commentID);
    if (comment) {
      comment.setValue(input.spamBanned, "spamBanned");
    }
  });
}

export const SetSpamBanned = createMutation("SetSpamBanned", commit);
