import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { signOff } from "talk-framework/rest";

export async function commit(
  environment: Environment,
  { rest, postMessage }: TalkContext
) {
  signOff(rest);
}

export const withSignOffMutation = createMutationContainer("signOff", commit);
