import { commitLocalUpdate, Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { LOCAL_ID } from "talk-framework/lib/relay/withLocalStateContainer";

export interface SetViewInput {
  // TODO: replace with generated typescript types.
  view: "SIGN_IN" | "SIGN_UP" | "FORGOT_PASSWORD" | "RESET_PASSWORD";
}

export type SetViewMutation = (input: SetViewInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetViewInput,
  { pym }: TalkContext
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue(input.view, "view");
  });
}

export const withSetViewMutation = createMutationContainer("setView", commit);
