import { GQLMutationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

const Mutation: GQLMutationTypeResolver<void> = {
  createComment: async (source, { input }, ctx) => ({
    comment: await ctx.mutators.Comment.create(input),
    clientMutationId: input.clientMutationId,
  }),
};

export default Mutation;
