import { commitLocalUpdate, Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation, LOCAL_ID } from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT_RL } from "coral-framework/schema";

export interface Input {
  sortOrder: GQLCOMMENT_SORT_RL;
}

export async function commit(
  environment: Environment,
  input: Input,
  context: CoralContext
) {
  return commitLocalUpdate(environment, (store) => {
    const localRecord = store.get(LOCAL_ID);
    if (!localRecord) {
      return;
    }

    localRecord.setValue(input.sortOrder, "moderationQueueSort");
  });
}

export const ChangeQueueSortMutation = createMutation(
  "ChangeQueueSortMutation",
  commit
);
