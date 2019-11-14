import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import { createMutationContainer } from "coral-framework/lib/relay";

import signOut from "../rest/signOut";
import SetAccessTokenMutation from "./SetAccessTokenMutation";

export type SignOutMutation = () => Promise<void>;

export async function commit(
  environment: Environment,
  input: undefined,
  ctx: CoralContext
) {
  await signOut(ctx.rest);
  await SetAccessTokenMutation.commit(environment, { accessToken: "" }, ctx);
}

export const withSignOutMutation = createMutationContainer("signOut", commit);
