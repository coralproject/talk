import { GQLMutationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

const Mutation: GQLMutationTypeResolver<void> = {
  createComment: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.create(input),
    clientMutationId: input.clientMutationId,
  }),
  updateSettings: async (source, { input }, ctx) => ({
    settings: await ctx.mutators.Settings.update(input.settings),
    clientMutationId: input.clientMutationId,
  }),
};

export default Mutation;
