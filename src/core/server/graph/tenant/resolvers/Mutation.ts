import { GQLMutationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

export const Mutation: GQLMutationTypeResolver<void> = {
  editComment: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.edit(input),
    clientMutationId: input.clientMutationId,
  }),
  createComment: async (source, { input }, ctx) => {
    const comment = await ctx.mutators.Comment.create(input);
    return {
      edge: {
        // NOTE: (cvle)
        // Depending on the sort we can't determine the accurate cursor in a
        // performant way, so we return null instead. It seems that Relay does
        // not directly use this value.
        cursor: null,
        node: comment,
      },
      clientMutationId: input.clientMutationId,
    };
  },
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
  removeCommentFlag: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.removeFlag(input),
    clientMutationId: input.clientMutationId,
  }),
  regenerateSSOKey: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.regenerateSSOKey(),
    clientMutationId: input.clientMutationId,
  }),
  createOIDCAuthIntegration: async (source, { input }, ctx) => {
    const result = await ctx.mutators.Settings.createOIDCAuthIntegration(input);
    if (!result) {
      return { clientMutationId: input.clientMutationId };
    }

    return {
      integration: result.integration,
      settings: result.tenant,
      clientMutationId: input.clientMutationId,
    };
  },
  updateOIDCAuthIntegration: async (source, { input }, ctx) => {
    const result = await ctx.mutators.Settings.updateOIDCAuthIntegration(input);
    if (!result) {
      return { clientMutationId: input.clientMutationId };
    }

    return {
      integration: result.integration,
      settings: result.tenant,
      clientMutationId: input.clientMutationId,
    };
  },
  removeOIDCAuthIntegration: async (source, { input }, ctx) => {
    const result = await ctx.mutators.Settings.removeOIDCAuthIntegration(input);
    if (!result) {
      return { clientMutationId: input.clientMutationId };
    }

    return {
      integration: result.integration,
      settings: result.tenant,
      clientMutationId: input.clientMutationId,
    };
  },
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
};
