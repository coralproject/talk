import { commitLocalUpdate, Environment } from "relay-runtime";

import { createMutation } from "coral-framework/lib/relay";

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
  return commitLocalUpdate(environment, (store) => {
    const proxy = store.get(input.storyID);
    if (!proxy) {
      return;
    }

    proxy.setValue(input.isClosed, "isClosed");
  });
}

export default createMutation("setStoryClosed", commit);
