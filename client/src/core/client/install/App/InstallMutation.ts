import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutationContainer } from "coral-framework/lib/relay";
import { SetAccessTokenMutation } from "coral-framework/mutations";
import { install, InstallInput } from "coral-framework/rest";

export type InstallMutation = (input: InstallInput) => Promise<void>;

export async function commit(
  environment: Environment,
  input: InstallInput,
  ctx: CoralContext
) {
  await install(ctx.rest, input);
  await SetAccessTokenMutation.commit(environment, { accessToken: "" }, ctx);
}

export const withInstallMutation = createMutationContainer("install", commit);
