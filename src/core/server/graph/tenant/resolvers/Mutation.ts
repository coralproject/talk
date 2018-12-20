import { GQLMutationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

export const Mutation: Required<GQLMutationTypeResolver<void>> = {
  editComment: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.edit(input),
    clientMutationId: input.clientMutationId,
  }),
  createComment: async (source, { input }, ctx) => ({
    edge: {
      // Depending on the sort we can't determine the accurate cursor in a
      // performant way, so we return null instead. It seems that Relay does
      // not directly use this value.
      cursor: null,
      node: await ctx.mutators.Comment.create(input),
    },
    clientMutationId: input.clientMutationId,
  }),
  createCommentReply: async (source, { input }, ctx) => ({
    edge: {
      // Depending on the sort we can't determine the accurate cursor in a
      // performant way, so we return null instead. It seems that Relay does
      // not directly use this value.
      cursor: null,
      node: await ctx.mutators.Comment.create(input),
    },
    clientMutationId: input.clientMutationId,
  }),
  updateSettings: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.update(input.settings),
    clientMutationId: input.clientMutationId,
  }),
  createCommentReaction: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.createReaction(input),
    clientMutationId: input.clientMutationId,
  }),
  removeCommentReaction: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.removeReaction(input),
    clientMutationId: input.clientMutationId,
  }),
  createCommentDontAgree: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.createDontAgree(input),
    clientMutationId: input.clientMutationId,
  }),
  removeCommentDontAgree: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.removeDontAgree(input),
    clientMutationId: input.clientMutationId,
  }),
  createCommentFlag: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.createFlag(input),
    clientMutationId: input.clientMutationId,
  }),
  regenerateSSOKey: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.regenerateSSOKey(),
    clientMutationId: input.clientMutationId,
  }),
  createStory: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Story.create(input),
    clientMutationId: input.clientMutationId,
  }),
  updateStory: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Story.update(input),
    clientMutationId: input.clientMutationId,
  }),
  mergeStories: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Story.merge(input),
    clientMutationId: input.clientMutationId,
  }),
  removeStory: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Story.remove(input),
    clientMutationId: input.clientMutationId,
  }),
  scrapeStory: async (source, { input }, ctx) => ({
    story: await ctx.mutators.Story.scrape(input),
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
    user: await ctx.mutators.User.setUsername(input),
    clientMutationId: input.clientMutationId,
  }),
  setEmail: async (source, { input }, ctx) => ({
    user: await ctx.mutators.User.setEmail(input),
    clientMutationId: input.clientMutationId,
  }),
  setPassword: async (source, { input }, ctx) => ({
    user: await ctx.mutators.User.setPassword(input),
    clientMutationId: input.clientMutationId,
  }),
  updatePassword: async (source, { input }, ctx) => ({
    user: await ctx.mutators.User.updatePassword(input),
    clientMutationId: input.clientMutationId,
  }),
};
