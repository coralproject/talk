import { GQLMutationTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const Mutation: Required<GQLMutationTypeResolver<void>> = {
  editComment: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comments.edit(input),
    clientMutationId: input.clientMutationId,
  }),
  createComment: async (source, { input }, ctx) => ({
    edge: {
      // Depending on the sort we can't determine the accurate cursor in a
      // performant way, so we return an empty string.
      cursor: "",
      node: await ctx.mutators.Comments.create(input),
    },
    clientMutationId: input.clientMutationId,
  }),
  createCommentReply: async (source, { input }, ctx) => ({
    edge: {
      // Depending on the sort we can't determine the accurate cursor in a
      // performant way, so we return an empty string.
      cursor: "",
      node: await ctx.mutators.Comments.create(input),
    },
    clientMutationId: input.clientMutationId,
  }),
  updateNotificationSettings: async (
    source,
    { input: { clientMutationId, ...input } },
    ctx
  ) => ({
    user: await ctx.mutators.Users.updateNotificationSettings(input),
    clientMutationId,
  }),
  updateSettings: async (
    source,
    { input: { clientMutationId, ...input } },
    ctx
  ) => ({
    settings: await ctx.mutators.Settings.update(input),
    clientMutationId,
  }),
  createCommentReaction: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comments.createReaction(input),
    clientMutationId: input.clientMutationId,
  }),
  removeCommentReaction: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comments.removeReaction(input),
    clientMutationId: input.clientMutationId,
  }),
  createCommentDontAgree: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comments.createDontAgree(input),
    clientMutationId: input.clientMutationId,
  }),
  removeCommentDontAgree: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comments.removeDontAgree(input),
    clientMutationId: input.clientMutationId,
  }),
  createCommentFlag: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comments.createFlag(input),
    clientMutationId: input.clientMutationId,
  }),
  featureComment: async (
    source,
    { input: { clientMutationId, ...input } },
    ctx
  ) => ({
    comment: await ctx.mutators.Comments.feature(input),
    clientMutationId,
  }),
  unfeatureComment: async (
    source,
    { input: { clientMutationId, ...input } },
    ctx
  ) => ({
    comment: await ctx.mutators.Comments.unfeature(input),
    clientMutationId,
  }),
  regenerateSSOKey: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.regenerateSSOKey(),
    clientMutationId: input.clientMutationId,
  }),
  rotateSSOKey: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.rotateSSOKey(input),
    clientMutationId: input.clientMutationId,
  }),
  deactivateSSOKey: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.deactivateSSOKey(input),
    clientMutationId: input.clientMutationId,
  }),
  deleteSSOKey: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.deleteSSOKey(input),
    clientMutationId: input.clientMutationId,
  }),
  createStory: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Stories.create(input),
    clientMutationId: input.clientMutationId,
  }),
  updateStory: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Stories.update(input),
    clientMutationId: input.clientMutationId,
  }),
  updateStorySettings: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Stories.updateSettings(input),
    clientMutationId: input.clientMutationId,
  }),
  closeStory: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Stories.close(input),
    clientMutationId: input.clientMutationId,
  }),
  openStory: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Stories.open(input),
    clientMutationId: input.clientMutationId,
  }),
  mergeStories: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Stories.merge(input),
    clientMutationId: input.clientMutationId,
  }),
  removeStory: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Stories.remove(input),
    clientMutationId: input.clientMutationId,
  }),
  scrapeStory: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Stories.scrape(input),
    clientMutationId: input.clientMutationId,
  }),
  approveComment: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Actions.approveComment(input),
    clientMutationId: input.clientMutationId,
  }),
  rejectComment: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Actions.rejectComment(input),
    clientMutationId: input.clientMutationId,
  }),
  inviteUsers: async (source, { input }, ctx) => ({
    invites: await ctx.mutators.Users.invite(input),
    clientMutationId: input.clientMutationId,
  }),
  setUsername: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.setUsername(input),
    clientMutationId: input.clientMutationId,
  }),
  setEmail: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.setEmail(input),
    clientMutationId: input.clientMutationId,
  }),
  setPassword: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.setPassword(input),
    clientMutationId: input.clientMutationId,
  }),
  updatePassword: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.updatePassword(input),
    clientMutationId: input.clientMutationId,
  }),
  createToken: async (source, { input }, ctx) => ({
    ...(await ctx.mutators.Users.createToken(input)),
    clientMutationId: input.clientMutationId,
  }),
  deactivateToken: async (source, { input }, ctx) => ({
    ...(await ctx.mutators.Users.deactivateToken(input)),
    clientMutationId: input.clientMutationId,
  }),
  updateUsername: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.updateUsername(input),
    clientMutationId: input.clientMutationId,
  }),
  updateUserUsername: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.updateUserUsername(input),
    clientMutationId: input.clientMutationId,
  }),
  updateEmail: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.updateEmail(input),
    clientMutationId: input.clientMutationId,
  }),
  updateUserEmail: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.updateUserEmail(input),
    clientMutationId: input.clientMutationId,
  }),
  updateUserAvatar: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.updateUserAvatar(input),
    clientMutationId: input.clientMutationId,
  }),
  updateUserRole: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.updateUserRole(input),
    clientMutationId: input.clientMutationId,
  }),
  banUser: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.ban(input),
    clientMutationId: input.clientMutationId,
  }),
  removeUserBan: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.removeBan(input),
    clientMutationId: input.clientMutationId,
  }),
  suspendUser: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.suspend(input),
    clientMutationId: input.clientMutationId,
  }),
  premodUser: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.premodUser(input),
    clientMutationId: input.clientMutationId,
  }),
  removeUserPremod: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.removeUserPremod(input),
    clientMutationId: input.clientMutationId,
  }),
  removeUserSuspension: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.removeSuspension(input),
    clientMutationId: input.clientMutationId,
  }),
  ignoreUser: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.ignore(input),
    clientMutationId: input.clientMutationId,
  }),
  removeUserIgnore: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.removeIgnore(input),
    clientMutationId: input.clientMutationId,
  }),
  requestCommentsDownload: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.requestCommentsDownload(input),
    clientMutationId: input.clientMutationId,
  }),
  requestUserCommentsDownload: async (source, { input }, ctx) => ({
    archiveURL: await ctx.mutators.Users.requestUserCommentsDownload(input),
    clientMutationId: input.clientMutationId,
  }),
  requestAccountDeletion: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.requestAccountDeletion(input),
    clientMutationId: input.clientMutationId,
  }),
  cancelAccountDeletion: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.cancelAccountDeletion(input),
    clientMutationId: input.clientMutationId,
  }),
  deleteUserAccount: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.deleteAccount(input),
    clientMutationId: input.clientMutationId,
  }),
  createModeratorNote: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.createModeratorNote(input),
    clientMutationId: input.clientMutationId,
  }),
  deleteModeratorNote: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.deleteModeratorNote(input),
    clientMutationId: input.clientMutationId,
  }),
  enableFeatureFlag: async (source, { input }, ctx) => ({
    flags: await ctx.mutators.Settings.enableFeatureFlag(input.flag),
    clientMutationId: input.clientMutationId,
  }),
  disableFeatureFlag: async (source, { input }, ctx) => ({
    flags: await ctx.mutators.Settings.disableFeatureFlag(input.flag),
    clientMutationId: input.clientMutationId,
  }),
  createAnnouncement: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.createAnnouncement(input),
    clientMutationId: input.clientMutationId,
  }),
  deleteAnnouncement: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.deleteAnnouncement(),
  }),
  createSite: async (source, { input }, ctx) => ({
    site: await ctx.mutators.Sites.create(input),
    clientMutationId: input.clientMutationId,
  }),
  updateSite: async (source, { input }, ctx) => ({
    site: await ctx.mutators.Sites.update(input),
    clientMutationId: input.clientMutationId,
  }),
  updateStoryMode: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Stories.updateStoryMode(input),
    clientMutationId: input.clientMutationId,
  }),
  addStoryExpert: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Stories.addStoryExpert(input),
    clientMutationId: input.clientMutationId,
  }),
  removeStoryExpert: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Stories.removeStoryExpert(input),
    clientMutationId: input.clientMutationId,
  }),
  createWebhookEndpoint: async (
    source,
    { input: { clientMutationId, ...input } },
    ctx
  ) => ({
    ...(await ctx.mutators.Settings.createWebhookEndpoint(input)),
    clientMutationId,
  }),
  updateWebhookEndpoint: async (
    source,
    { input: { clientMutationId, ...input } },
    ctx
  ) => ({
    endpoint: await ctx.mutators.Settings.updateWebhookEndpoint(input),
    clientMutationId,
  }),
  disableWebhookEndpoint: async (
    source,
    { input: { clientMutationId, ...input } },
    ctx
  ) => ({
    endpoint: await ctx.mutators.Settings.disableWebhookEndpoint(input),
    clientMutationId,
  }),
  enableWebhookEndpoint: async (
    source,
    { input: { clientMutationId, ...input } },
    ctx
  ) => ({
    endpoint: await ctx.mutators.Settings.enableWebhookEndpoint(input),
    clientMutationId,
  }),
  deleteWebhookEndpoint: async (
    source,
    { input: { clientMutationId, ...input } },
    ctx
  ) => ({
    endpoint: await ctx.mutators.Settings.deleteWebhookEndpoint(input),
    clientMutationId,
  }),
  rotateWebhookEndpointSecret: async (
    source,
    { input: { clientMutationId, ...input } },
    ctx
  ) => ({
    endpoint: await ctx.mutators.Settings.rotateWebhookEndpointSecret(input),
    clientMutationId,
  }),
};
