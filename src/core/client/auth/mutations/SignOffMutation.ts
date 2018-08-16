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
  await signOff(rest, input);
  // tslint:disable-next-line:no-console
  console.log("Signing off");
  localStorage.removeItem("authToken");
}

export const withSignOffMutation = createMutationContainer("signOff", commit);
