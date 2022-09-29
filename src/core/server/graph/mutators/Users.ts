import { ERROR_CODES } from "coral-common/errors";
import GraphContext from "coral-server/graph/context";
import { mapFieldsetToErrorCodes } from "coral-server/graph/errors";
import { User } from "coral-server/models/user";
import {
  acknowledgeModMessage,
  acknowledgeWarning,
  addModeratorNote,
  ban,
  cancelAccountDeletion,
  createToken,
  deactivateToken,
  demoteMember,
  demoteModerator,
  destroyModeratorNote,
  ignore,
  premod,
  promoteMember,
  promoteModerator,
  removeBan,
  removeIgnore,
  removePremod,
  removeSuspension,
  removeWarning,
  requestAccountDeletion,
  requestCommentsDownload,
  requestUserCommentsDownload,
  sendModMessage,
  setEmail,
  setPassword,
  setUsername,
  suspend,
  updateAvatar,
  updateBio,
  updateEmail,
  updateEmailByID,
  updateMediaSettings,
  updateMembershipScopes,
  updateModerationScopes,
  updateNotificationSettings,
  updatePassword,
  updateRole,
  updateSSOProfileID,
  updateUserBan,
  updateUsername,
  updateUsernameByID,
  warn,
} from "coral-server/services/users";
import { invite } from "coral-server/services/users/auth/invite";
import { deleteUser } from "coral-server/services/users/delete";

import {
  GQLBanUserInput,
  GQLCancelAccountDeletionInput,
  GQLCreateModeratorNoteInput,
  GQLCreateTokenInput,
  GQLDeactivateTokenInput,
  GQLDeleteModeratorNoteInput,
  GQLDeleteUserAccountInput,
  GQLDemoteMemberInput,
  GQLDemoteModeratorInput,
  GQLIgnoreUserInput,
  GQLInviteUsersInput,
  GQLPremodUserInput,
  GQLPromoteMemberInput,
  GQLPromoteModeratorInput,
  GQLRemovePremodUserInput,
  GQLRemoveUserBanInput,
  GQLRemoveUserIgnoreInput,
  GQLRemoveUserSuspensionInput,
  GQLRemoveUserWarningInput,
  GQLRequestAccountDeletionInput,
  GQLRequestCommentsDownloadInput,
  GQLRequestUserCommentsDownloadInput,
  GQLSendModMessageInput,
  GQLSetEmailInput,
  GQLSetPasswordInput,
  GQLSetUsernameInput,
  GQLSuspendUserInput,
  GQLUpdateBioInput,
  GQLUpdateEmailInput,
  GQLUpdateNotificationSettingsInput,
  GQLUpdatePasswordInput,
  GQLUpdateSSOProfileIDInput,
  GQLUpdateUserAvatarInput,
  GQLUpdateUserBanInput,
  GQLUpdateUserEmailInput,
  GQLUpdateUserMediaSettingsInput,
  GQLUpdateUserMembershipScopesInput,
  GQLUpdateUserModerationScopesInput,
  GQLUpdateUsernameInput,
  GQLUpdateUserRoleInput,
  GQLUpdateUserUsernameInput,
  GQLWarnUserInput,
} from "coral-server/graph/schema/__generated__/types";

import { WithoutMutationID } from "./util";

export const Users = (ctx: GraphContext) => ({
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
  requestAccountDeletion: async (
    input: GQLRequestAccountDeletionInput
  ): Promise<Readonly<User> | null> =>
    mapFieldsetToErrorCodes(
      requestAccountDeletion(
        ctx.mongo,
        ctx.mailerQueue,
        ctx.tenant,
        ctx.user!,
        input.password,
        ctx.now
      ),
      { "input.password": [ERROR_CODES.PASSWORD_INCORRECT] }
    ),
  deleteAccount: async (
    input: GQLDeleteUserAccountInput
  ): Promise<Readonly<User> | null> => {
    if (input.userID === ctx.user!.id) {
      throw new Error("cannot delete self immediately");
    }

    return deleteUser(
      ctx.mongo,
      ctx.redis,
      input.userID,
      ctx.tenant.id,
      ctx.now
    );
  },
  cancelAccountDeletion: async (
    input: GQLCancelAccountDeletionInput
  ): Promise<Readonly<User> | null> =>
    cancelAccountDeletion(ctx.mongo, ctx.mailerQueue, ctx.tenant, ctx.user!),
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
  updateSSOProfileID: async (input: GQLUpdateSSOProfileIDInput) =>
    updateSSOProfileID(ctx.mongo, ctx.tenant, input.userID, input.ssoProfileID),
  updateUsername: async (input: GQLUpdateUsernameInput) =>
    updateUsername(
      ctx.mongo,
      ctx.mailerQueue,
      ctx.tenant,
      ctx.user!,
      input.username,
      ctx.now
    ),
  updateUserUsername: async (input: GQLUpdateUserUsernameInput) =>
    updateUsernameByID(
      ctx.mongo,
      ctx.tenant,
      input.userID,
      input.username,
      ctx.user!
    ),
  updateBio: async (input: GQLUpdateBioInput) =>
    updateBio(ctx.mongo, ctx.tenant, ctx.user!, input.bio),
  updateUserEmail: async (input: GQLUpdateUserEmailInput) =>
    updateEmailByID(ctx.mongo, ctx.tenant, input.userID, input.email),
  updateEmail: async (input: GQLUpdateEmailInput) =>
    updateEmail(
      ctx.mongo,
      ctx.tenant,
      ctx.mailerQueue,
      ctx.config,
      ctx.signingConfig!,
      ctx.user!,
      input.email,
      input.password
    ),
  updateNotificationSettings: async (
    input: WithoutMutationID<GQLUpdateNotificationSettingsInput>
  ) => updateNotificationSettings(ctx.mongo, ctx.tenant, ctx.user!, input),
  updateUserMediaSettings: async (
    input: WithoutMutationID<GQLUpdateUserMediaSettingsInput>
  ) => updateMediaSettings(ctx.mongo, ctx.tenant, ctx.user!, input),
  updateUserAvatar: async (input: GQLUpdateUserAvatarInput) =>
    updateAvatar(ctx.mongo, ctx.tenant, input.userID, input.avatar),
  updateUserRole: async (input: GQLUpdateUserRoleInput) =>
    updateRole(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      input.userID,
      input.role,
      input.siteIDs
    ),
  promoteModerator: async (input: GQLPromoteModeratorInput) =>
    promoteModerator(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      input.userID,
      input.siteIDs
    ),
  demoteModerator: async (input: GQLDemoteModeratorInput) =>
    demoteModerator(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      input.userID,
      input.siteIDs
    ),
  promoteMember: async (input: GQLPromoteMemberInput) =>
    promoteMember(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      input.userID,
      input.siteIDs
    ),
  demoteMember: async (input: GQLDemoteMemberInput) =>
    demoteMember(ctx.mongo, ctx.tenant, ctx.user!, input.userID, input.siteIDs),
  updateUserModerationScopes: async (
    input: GQLUpdateUserModerationScopesInput
  ) =>
    updateModerationScopes(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      input.userID,
      input.moderationScopes
    ),
  updateUserMembershipScopes: async (
    input: GQLUpdateUserMembershipScopesInput
  ) =>
    updateMembershipScopes(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      input.userID,
      input.membershipScopes.siteIDs
    ),
  createModeratorNote: async (input: GQLCreateModeratorNoteInput) =>
    addModeratorNote(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      input.userID,
      input.body,
      ctx.now
    ),
  deleteModeratorNote: async (input: GQLDeleteModeratorNoteInput) =>
    destroyModeratorNote(
      ctx.mongo,
      ctx.tenant,
      input.userID,
      input.id,
      ctx.user!
    ),
  ban: async ({
    userID,
    message,
    rejectExistingComments = false,
    siteIDs,
  }: GQLBanUserInput) =>
    ban(
      ctx.mongo,
      ctx.mailerQueue,
      ctx.rejectorQueue,
      ctx.tenant,
      ctx.user!,
      userID,
      message,
      rejectExistingComments,
      siteIDs,
      ctx.now
    ),
  updateUserBan:
    async ({
      userID,
      message,
      rejectExistingComments = false,
      banSiteIDs,
      unbanSiteIDs,
    }: GQLUpdateUserBanInput) =>
    async () =>
      updateUserBan(
        ctx.mongo,
        ctx.mailerQueue,
        ctx.rejectorQueue,
        ctx.tenant,
        ctx.user!,
        userID,
        message,
        rejectExistingComments,
        banSiteIDs,
        unbanSiteIDs,
        ctx.now
      ),
  warn: async (input: GQLWarnUserInput) =>
    warn(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      input.userID,
      input.message,
      ctx.now
    ),
  removeWarning: async (input: GQLRemoveUserWarningInput) =>
    removeWarning(ctx.mongo, ctx.tenant, ctx.user!, input.userID, ctx.now),
  acknowledgeWarning: async () =>
    acknowledgeWarning(ctx.mongo, ctx.tenant, ctx.user!.id, ctx.now),
  sendModMessage: async (input: GQLSendModMessageInput) =>
    sendModMessage(
      ctx.mongo,
      ctx.tenant,
      ctx.user!,
      input.userID,
      input.message,
      ctx.now
    ),
  acknowledgeModMessage: async () =>
    acknowledgeModMessage(ctx.mongo, ctx.tenant, ctx.user!.id, ctx.now),
  premodUser: async (input: GQLPremodUserInput) =>
    premod(ctx.mongo, ctx.tenant, ctx.user!, input.userID, ctx.now),
  suspend: async (input: GQLSuspendUserInput) =>
    suspend(
      ctx.mongo,
      ctx.mailerQueue,
      ctx.tenant,
      ctx.user!,
      input.userID,
      input.timeout,
      input.message,
      ctx.now
    ),
  removeBan: async (input: GQLRemoveUserBanInput) =>
    removeBan(ctx.mongo, ctx.tenant, ctx.user!, input.userID, ctx.now),
  removeSuspension: async (input: GQLRemoveUserSuspensionInput) =>
    removeSuspension(ctx.mongo, ctx.tenant, ctx.user!, input.userID, ctx.now),
  removeUserPremod: async (input: GQLRemovePremodUserInput) =>
    removePremod(ctx.mongo, ctx.tenant, ctx.user!, input.userID, ctx.now),
  ignore: async (input: GQLIgnoreUserInput) =>
    ignore(ctx.mongo, ctx.tenant, ctx.user!, input.userID, ctx.now),
  removeIgnore: async (input: GQLRemoveUserIgnoreInput) =>
    removeIgnore(ctx.mongo, ctx.tenant, ctx.user!, input.userID),
  requestUserCommentsDownload: async (
    input: GQLRequestUserCommentsDownloadInput
  ) =>
    requestUserCommentsDownload(
      ctx.mongo,
      ctx.tenant,
      ctx.config,
      ctx.signingConfig!,
      input.userID,
      ctx.now
    ),
  requestCommentsDownload: async (input: GQLRequestCommentsDownloadInput) =>
    requestCommentsDownload(
      ctx.mongo,
      ctx.mailerQueue,
      ctx.tenant,
      ctx.config,
      ctx.signingConfig!,
      ctx.user!,
      ctx.now
    ),
});
