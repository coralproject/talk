import { Environment } from "relay-runtime";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import { install, InstallInput } from "talk-framework/rest";

export type InstallMutation = (input: InstallInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: InstallInput,
  { rest }: TalkContext
) {
  await install(rest, input);
}

export const withInstallMutation = createMutationContainer("install", commit);
