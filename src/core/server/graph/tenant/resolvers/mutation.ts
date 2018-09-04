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
        // FIXME: (wyattjoh) when we're using a replies/respect sort, it is index based instead of date based, needs some work!
        cursor: comment.created_at,
        node: comment,
      },
      clientMutationId: input.clientMutationId,
    };
  },
  updateSettings: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.update(input.settings),
    clientMutationId: input.clientMutationId,
  }),
};

export default Mutation;
