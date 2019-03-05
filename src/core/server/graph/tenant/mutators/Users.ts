import { ERROR_CODES } from "talk-common/errors";
import { mapFieldsetToErrorCodes } from "talk-server/graph/common/errors";
import TenantContext from "talk-server/graph/tenant/context";
import { User } from "talk-server/models/user";
import {
  createToken,
  deactivateToken,
  setEmail,
  setPassword,
  setUsername,
  updateAvatar,
  updateDisplayName,
  updateEmail,
  updatePassword,
  updateRole,
  updateUsername,
} from "talk-server/services/users";
import {
  GQLCreateTokenInput,
  GQLDeactivateTokenInput,
  GQLSetEmailInput,
  GQLSetPasswordInput,
  GQLSetUsernameInput,
  GQLUpdatePasswordInput,
  GQLUpdateUserAvatarInput,
  GQLUpdateUserDisplayNameInput,
  GQLUpdateUserEmailInput,
  GQLUpdateUserRoleInput,
  GQLUpdateUserUsernameInput,
} from "../schema/__generated__/types";

export const Users = (ctx: TenantContext) => ({
  setUsername: async (
    input: GQLSetUsernameInput
  ): Promise<Readonly<User> | null> =>
    mapFieldsetToErrorCodes(
      setUsername(ctx.mongo, ctx.tenant, ctx.user!, input.username),
      {
        "input.username": [
          ERROR_CODES.USERNAME_ALREADY_SET,
          ERROR_CODES.USERNAME_CONTAINS_INVALID_CHARACTERS,
          ERROR_CODES.USERNAME_EXCEEDS_MAX_LENGTH,
          ERROR_CODES.USERNAME_TOO_SHORT,
          ERROR_CODES.DUPLICATE_USERNAME,
        ],
      }
    ),
  setEmail: async (input: GQLSetEmailInput): Promise<Readonly<User> | null> =>
    mapFieldsetToErrorCodes(
      setEmail(ctx.mongo, ctx.tenant, ctx.user!, input.email),
      {
        "input.email": [
          ERROR_CODES.EMAIL_ALREADY_SET,
          ERROR_CODES.DUPLICATE_EMAIL,
          ERROR_CODES.EMAIL_INVALID_FORMAT,
          ERROR_CODES.EMAIL_EXCEEDS_MAX_LENGTH,
        ],
      }
    ),
  setPassword: async (
    input: GQLSetPasswordInput
  ): Promise<Readonly<User> | null> =>
    setPassword(ctx.mongo, ctx.tenant, ctx.user!, input.password),
  updatePassword: async (
    input: GQLUpdatePasswordInput
  ): Promise<Readonly<User> | null> =>
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
  updateUserUsername: async (input: GQLUpdateUserUsernameInput) =>
    updateUsername(ctx.mongo, ctx.tenant, input.userID, input.username),
  updateUserDisplayName: async (input: GQLUpdateUserDisplayNameInput) =>
    updateDisplayName(ctx.mongo, ctx.tenant, input.userID, input.displayName),
  updateUserEmail: async (input: GQLUpdateUserEmailInput) =>
    updateEmail(ctx.mongo, ctx.tenant, input.userID, input.email),
  updateUserAvatar: async (input: GQLUpdateUserAvatarInput) =>
    updateAvatar(ctx.mongo, ctx.tenant, input.userID, input.avatar),
  updateUserRole: async (input: GQLUpdateUserRoleInput) =>
    updateRole(ctx.mongo, ctx.tenant, input.userID, input.role),
});
