import { GQLMutationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

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
  updateSettings: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.update(input),
    clientMutationId: input.clientMutationId,
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
  regenerateSSOKey: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.regenerateSSOKey(),
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
  acceptComment: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Actions.acceptComment(input),
    clientMutationId: input.clientMutationId,
  }),
  rejectComment: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Actions.rejectComment(input),
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
  updateUserUsername: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.updateUserUsername(input),
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
  removeUserSuspension: async (source, { input }, ctx) => ({
    user: await ctx.mutators.Users.removeSuspension(input),
    clientMutationId: input.clientMutationId,
  }),
};
