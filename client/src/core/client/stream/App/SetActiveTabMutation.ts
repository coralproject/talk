import { commitLocalUpdate, Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  createMutation,
  createMutationContainer,
  LOCAL_ID,
} from "coral-framework/lib/relay";
import { SetMainTabEvent } from "coral-stream/events";

export interface SetActiveTabInput {
  tab: "COMMENTS" | "PROFILE" | "DISCUSSIONS" | "%future added value";
}

export type SetActiveTabMutation = (input: SetActiveTabInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SetActiveTabInput,
  { eventEmitter }: Pick<CoralContext, "eventEmitter">
) {
  return commitLocalUpdate(environment, (store) => {
    const record = store.get(LOCAL_ID)!;
    if (record.getValue("activeTab") !== input.tab) {
      SetMainTabEvent.emit(eventEmitter, { tab: input.tab });
      record.setValue(input.tab, "activeTab");
    }
  });
}

export const Mutation = createMutation("setActiveTab", commit);

export const withSetActiveTabMutation = createMutationContainer(
  "setActiveTab",
  commit
);
