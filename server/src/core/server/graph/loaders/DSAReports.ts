import DataLoader from "dataloader";
import { defaultTo } from "lodash";

import TenantContext from "coral-server/graph/context";
import {
  DSAReport,
  retrieveDSAReportConnection,
  retrieveManyDSAReports,
  DSAReportConnectionInput,
} from "coral-server/models/dsaReport";

import {
  GQLDSAREPORT_STATUS_FILTER,
  GQLREPORT_SORT,
  QueryToDsaReportsArgs,
} from "coral-server/graph/schema/__generated__/types";

type DSAReportConnectionFilterInput = DSAReportConnectionInput["filter"];

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

export default (ctx: TenantContext) => ({
  dsaReport: new DataLoader<string, DSAReport | null>(
    (ids) => retrieveManyDSAReports(ctx.mongo, ctx.tenant.id, ids),
    {
      cache: !ctx.disableCaching,
    }
  ),
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
});
