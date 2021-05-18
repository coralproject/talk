import { commitLocalUpdate, Environment } from "relay-runtime";

import { MOD_QUEUE_SORT_ORDER } from "coral-admin/constants";
import { GQLCOMMENT_SORT } from "coral-admin/schema";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutation, LOCAL_ID } from "coral-framework/lib/relay";

export interface Input {
  sortOrder: GQLCOMMENT_SORT;
}

export async function commit(
  environment: Environment,
  input: Input,
  context: CoralContext
) {
  // Set in local storage
  await context.localStorage.setItem(MOD_QUEUE_SORT_ORDER, input.sortOrder);

  // Set in Relay
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
