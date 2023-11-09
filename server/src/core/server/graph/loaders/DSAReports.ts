import DataLoader from "dataloader";

import { find } from "coral-server/models/dsaReport/report";

import GraphContext from "../context";
import { createManyBatchLoadFn } from "./util";

export interface FindDSAReportInput {
  id: string;
}

export default (ctx: GraphContext) => ({
  dsaReport: new DataLoader(
    createManyBatchLoadFn((input: FindDSAReportInput) =>
      find(ctx.mongo, ctx.tenant, input)
    ),
    {
      cacheKeyFn: (input: FindDSAReportInput) => `${input.id}`,
      cache: !ctx.disableCaching,
    }
  ),
});
