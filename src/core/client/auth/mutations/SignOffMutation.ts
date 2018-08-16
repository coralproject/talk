import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { signOff, SignOffInput } from "talk-framework/rest";

export type SignOffMutation = (input: SignOffInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SignOffInput,
  { rest, localStorage }: TalkContext
) {
  try {
    await signOff(rest, input);
    localStorage.removeItem("authToken");
  } catch (error) {
    localStorage.removeItem("authToken");
    // tslint:disable-next-line:no-console
    console.error("error", error);
  }
}

export const withSignOffMutation = createMutationContainer("signOff", commit);
