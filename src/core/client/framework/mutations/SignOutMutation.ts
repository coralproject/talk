import { Environment } from "relay-runtime";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { createMutationContainer } from "talk-framework/lib/relay";
import signOut from "../rest/signOut";
import { commit as setAuthToken } from "./SetAuthTokenMutation";

export type SignOutMutation = () => Promise<void>;

export async function commit(environment: Environment, ctx: TalkContext) {
  await setAuthToken(environment, { authToken: "" }, ctx);
  await signOut(ctx.rest);
}

export const withSignOutMutation = createMutationContainer("signOut", commit);
