import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutationContainer } from "coral-framework/lib/relay";
import { install, InstallInput } from "coral-framework/rest";

export type InstallMutation = (input: InstallInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: InstallInput,
  { rest }: CoralContext
) {
  await install(rest, input);
}

export const withInstallMutation = createMutationContainer("install", commit);
