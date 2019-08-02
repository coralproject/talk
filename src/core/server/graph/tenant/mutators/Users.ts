import { ERROR_CODES } from "coral-common/errors";
import { mapFieldsetToErrorCodes } from "coral-server/graph/common/errors";
import TenantContext from "coral-server/graph/tenant/context";
import { User } from "coral-server/models/user";
import {
  ban,
  createToken,
  deactivateToken,
  ignore,
  removeBan,
  removeIgnore,
  removeSuspension,
  setEmail,
  setPassword,
  setUsername,
  suspend,
  updateAvatar,
  updateEmail,
  updatePassword,
  updateRole,
  updateUsername,
} from "coral-server/services/users";
import { invite } from "coral-server/services/users/auth/invite";

import {
  GQLBanUserInput,
  GQLCreateTokenInput,
  GQLDeactivateTokenInput,
  GQLIgnoreUserInput,
  GQLInviteUsersInput,
  GQLRemoveUserBanInput,
  GQLRemoveUserIgnoreInput,
  GQLRemoveUserSuspensionInput,
  GQLSetEmailInput,
  GQLSetPasswordInput,
  GQLSetUsernameInput,
  GQLSuspendUserInput,
  GQLUpdatePasswordInput,
  GQLUpdateUserAvatarInput,
  GQLUpdateUserEmailInput,
  GQLUpdateUserRoleInput,
  GQLUpdateUserUsernameInput,
} from "../schema/__generated__/types";

export const Users = (ctx: TenantContext) => ({
  invite: async ({ role, emails }: GQLInviteUsersInput) =>
    mapFieldsetToErrorCodes(
      invite(
        ctx.mongo,
        ctx.tenant,
        ctx.config,
        ctx.mailerQueue,
        ctx.signingConfig!,
        { role, emails },
        ctx.user!,
        ctx.now
      ),
      {
        "input.emails": [
          ERROR_CODES.EMAIL_INVALID_FORMAT,
          ERROR_CODES.EMAIL_EXCEEDS_MAX_LENGTH,
        ],
      }
    ),
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
        ],
      }
    ),
  setEmail: async (input: GQLSetEmailInput): Promise<Readonly<User> | null> =>
    mapFieldsetToErrorCodes(
      setEmail(ctx.mongo, ctx.mailerQueue, ctx.tenant, ctx.user!, input.email),
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
    mapFieldsetToErrorCodes(
      updatePassword(
        ctx.mongo,
        ctx.mailerQueue,
        ctx.tenant,
        ctx.user!,
        input.oldPassword,
        input.newPassword
      ),
      { "input.oldPassword": [ERROR_CODES.PASSWORD_INCORRECT] }
    ),
  createToken: async (input: GQLCreateTokenInput) =>
    createToken(
      ctx.mongo,
      ctx.tenant,
      // NOTE: (wyattjoh) this will error if not provided.
      ctx.signingConfig!,
      ctx.user!,
      input.name,
      ctx.now
    ),
  deactivateToken: async (input: GQLDeactivateTokenInput) =>
    deactivateToken(ctx.mongo, ctx.tenant, ctx.user!, input.id),
  updateUserUsername: async (input: GQLUpdateUserUsernameInput) =>
    updateUsername(ctx.mongo, ctx.tenant, input.userID, input.username),
  updateUserEmail: async (input: GQLUpdateUserEmailInput) =>
    updateEmail(ctx.mongo, ctx.tenant, input.userID, input.email),
  updateUserAvatar: async (input: GQLUpdateUserAvatarInput) =>
    updateAvatar(ctx.mongo, ctx.tenant, input.userID, input.avatar),
  updateUserRole: async (input: GQLUpdateUserRoleInput) =>
    updateRole(ctx.mongo, ctx.tenant, ctx.user!, input.userID, input.role),
  ban: async (input: GQLBanUserInput) =>
    ban(
      ctx.mongo,
      ctx.mailerQueue,
      ctx.tenant,
      ctx.user!,
      input.userID,
      ctx.now
    ),
  suspend: async (input: GQLSuspendUserInput) =>
    suspend(
      ctx.mongo,
      ctx.mailerQueue,
      ctx.tenant,
      ctx.user!,
      input.userID,
      input.timeout,
      ctx.now
    ),
  removeBan: async (input: GQLRemoveUserBanInput) =>
    removeBan(ctx.mongo, ctx.tenant, ctx.user!, input.userID, ctx.now),
  removeSuspension: async (input: GQLRemoveUserSuspensionInput) =>
    removeSuspension(ctx.mongo, ctx.tenant, ctx.user!, input.userID, ctx.now),
  ignore: async (input: GQLIgnoreUserInput) =>
    ignore(ctx.mongo, ctx.tenant, ctx.user!, input.userID, ctx.now),
  removeIgnore: async (input: GQLRemoveUserIgnoreInput) =>
    removeIgnore(ctx.mongo, ctx.tenant, ctx.user!, input.userID),
});
