import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutationContainer } from "talk-framework/lib/relay";

export interface SetStoryClosedInput {
  storyID: string;
  isClosed: boolean;
}

export type SetStoryClosedMutation = (
  input: SetStoryClosedInput
) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetStoryClosedInput
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(input.storyID)!;
    record.setValue(input.isClosed, "isClosed");
  });
}

export const withSetStoryClosedMutation = createMutationContainer(
  "setStoryClosed",
  commit
);
