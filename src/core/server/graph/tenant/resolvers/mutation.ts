import { ClientMutationProps } from "talk-server/graph/common/resolvers/mutation";
import TenantContext from "talk-server/graph/tenant/context";
import { Comment } from "talk-server/models/comment";

export interface CreateCommentInput extends ClientMutationProps {
  assetID: string;
  parentID?: string;
  body: string;
}

export interface CreateCommentPayload extends ClientMutationProps {
  comment: Comment;
}

const Mutation = {
  createComment: async (
    _source: void,
    input: CreateCommentInput,
    ctx: TenantContext
  ): Promise<CreateCommentPayload> => ({
    comment: await ctx.mutators.Comment.create(input),
    clientMutationId: input.clientMutationId,
  }),
};

export default Mutation;
