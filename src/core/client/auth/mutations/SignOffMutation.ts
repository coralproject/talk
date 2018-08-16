import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { signOff, SignOffInput } from "talk-framework/rest";

export type SignOffMutation = (input: SignOffInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: SignOffInput,
  { rest, postMessage }: TalkContext
) {
  try {
    await signOff(rest, input);
    console.log("signing off");
    // postMessage.send("setAuthToken", result.token, window.opener);
    // window.close();
  } catch (err) {
    // postMessage.send("authError", err.toString(), window.opener);
  }
}

export const withSignOffMutation = createMutationContainer("signOff", commit);
