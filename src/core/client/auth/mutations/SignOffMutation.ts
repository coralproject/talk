import { LOCAL_ID } from "talk-framework/lib/relay/withLocalStateContainer";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { SignOffInput } from "talk-framework/rest";
import { commitLocalUpdate, Environment } from "relay-runtime";

export type SignOffMutation = (input: SignOffInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SignOffInput,
  { localStorage }: TalkContext
) {
  return commitLocalUpdate(environment, store => {
    const record = store.get(LOCAL_ID)!;
    record.setValue("", "authToken");
    localStorage.removeItem("authToken");

    // Force gc to trigger.
    environment
      .retain({
        dataID: "tmp",
        node: { selections: [] },
        variables: {},
      })
      .dispose();
  });
}

export const withSignOffMutation = createMutationContainer("signOff", commit);
