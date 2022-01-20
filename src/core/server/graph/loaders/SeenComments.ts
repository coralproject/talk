import DataLoader from "dataloader";

import { find } from "coral-server/services/seenComments";

import GraphContext from "../context";
import { createManyBatchLoadFn } from "./util";

export interface FindSeenCommentsInput {
  storyID: string;
  userID: string;
}

export default (ctx: GraphContext) => ({
  find: new DataLoader(
    createManyBatchLoadFn((input: FindSeenCommentsInput) =>
      find(ctx.mongo, ctx.tenant, input)
    ),
    {
      cacheKeyFn: (input: FindSeenCommentsInput) =>
        `${input.storyID}:${input.userID}`,
      cache: !ctx.disableCaching,
    }
  ),
});
