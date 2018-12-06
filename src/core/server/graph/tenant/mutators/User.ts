import TenantContext from "talk-server/graph/tenant/context";
import * as user from "talk-server/models/user";
import {
  setEmail,
  setPassword,
  setUsername,
  updatePassword,
} from "talk-server/services/users";
import {
  GQLSetEmailInput,
  GQLSetPasswordInput,
  GQLSetUsernameInput,
  GQLUpdatePasswordInput,
} from "../schema/__generated__/types";

export const User = (ctx: TenantContext) => ({
  setUsername: async (
    input: GQLSetUsernameInput
  ): Promise<Readonly<user.User> | null> =>
    setUsername(ctx.mongo, ctx.tenant, ctx.user!, input.username),
  setEmail: async (
    input: GQLSetEmailInput
  ): Promise<Readonly<user.User> | null> =>
    setEmail(ctx.mongo, ctx.tenant, ctx.user!, input.email),
  setPassword: async (
    input: GQLSetPasswordInput
  ): Promise<Readonly<user.User> | null> =>
    setPassword(ctx.mongo, ctx.tenant, ctx.user!, input.password),
  updatePassword: async (
    input: GQLUpdatePasswordInput
  ): Promise<Readonly<user.User> | null> =>
    updatePassword(ctx.mongo, ctx.tenant, ctx.user!, input.password),
});
