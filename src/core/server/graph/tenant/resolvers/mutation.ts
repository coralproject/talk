import { GQLMutationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

const Mutation: GQLMutationTypeResolver<void> = {
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
  deleteCommentReaction: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.deleteReaction(input),
    clientMutationId: input.clientMutationId,
  }),
  createCommentDontAgree: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.createDontAgree(input),
    clientMutationId: input.clientMutationId,
  }),
  deleteCommentDontAgree: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.deleteDontAgree(input),
    clientMutationId: input.clientMutationId,
  }),
  createCommentFlag: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.createFlag(input),
    clientMutationId: input.clientMutationId,
  }),
  deleteCommentFlag: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.deleteFlag(input),
    clientMutationId: input.clientMutationId,
  }),
  regenerateSSOKey: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.regenerateSSOKey(),
    clientMutationId: input.clientMutationId,
  }),
  discoverOIDCConfiguration: async (source, { input }, ctx) => ({
    configuration: await ctx.mutators.Settings.discoverOIDCConfiguration(input),
    clientMutationId: input.clientMutationId,
  }),
};

export default Mutation;
