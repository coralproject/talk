import { Environment } from "relay-runtime";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import signOut from "../rest/signOut";
import { commit as setAccessToken } from "./SetAccessTokenMutation";

export type SignOutMutation = () => Promise<void>;

export async function commit(
  environment: Environment,
  input: undefined,
  ctx: TalkContext
) {
  await signOut(ctx.rest);
  await setAccessToken(environment, { accessToken: "" }, ctx);
}

export const withSignOutMutation = createMutationContainer("signOut", commit);
