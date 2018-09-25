import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutationContainer } from "talk-framework/lib/relay";
import { LOCAL_ID } from "talk-framework/lib/relay/withLocalStateContainer";

export interface SetViewInput {
  view: "MODERATE" | "COMMUNITY" | "STORIES" | "CONFIGURE";
}

export type SetViewMutation = (input: SetViewInput) => Promise<void>;

export async function commit(environment: Environment, input: SetViewInput) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(input.view, "view");
  });
}

export const withSetViewMutation = createMutationContainer("setView", commit);
