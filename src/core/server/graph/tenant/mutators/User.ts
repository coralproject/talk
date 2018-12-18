import TenantContext from "talk-server/graph/tenant/context";
import * as user from "talk-server/models/user";
import {
  createToken,
  deactivateToken,
  setEmail,
  setPassword,
  setUsername,
  updatePassword,
} from "talk-server/services/users";
import {
  GQLCreateTokenInput,
  GQLDeactivateTokenInput,
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
  createToken: async (input: GQLCreateTokenInput) =>
    createToken(
      ctx.mongo,
      ctx.tenant,
      // NOTE: (wyattjoh) this will error if not provided.
      ctx.signingConfig!,
      ctx.user!,
      input.name
    ),
  deactivateToken: async (input: GQLDeactivateTokenInput) =>
    deactivateToken(ctx.mongo, ctx.tenant, ctx.user!, input.id),
});
