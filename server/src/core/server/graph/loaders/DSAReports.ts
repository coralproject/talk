import DataLoader from "dataloader";
import { defaultTo } from "lodash";

import {
  DSAReportConnectionInput,
  find,
  retrieveDSAReportConnection,
} from "coral-server/models/dsaReport";

import GraphContext from "../context";
import { createManyBatchLoadFn } from "./util";

import {
  GQLDSAREPORT_STATUS_FILTER,
  GQLREPORT_SORT,
  QueryToDsaReportsArgs,
} from "coral-server/graph/schema/__generated__/types";

type DSAReportConnectionFilterInput = DSAReportConnectionInput["filter"];

export interface FindDSAReportInput {
  id: string;
}

const statusFilter = (
  status?: GQLDSAREPORT_STATUS_FILTER[]
): DSAReportConnectionFilterInput => {
  if (status) {
    return {
      status: { $in: status },
    };
  }
  return {};
};

export default (ctx: GraphContext) => ({
  connection: ({ first, after, orderBy, status }: QueryToDsaReportsArgs) =>
    retrieveDSAReportConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 20),
      after,
      orderBy: defaultTo(orderBy, GQLREPORT_SORT.CREATED_AT_DESC),
      filter: {
        // Merge the status filters into the query.
        ...statusFilter(status),
      },
    }),
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
