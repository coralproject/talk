import DataLoader from "dataloader";
import { defaultTo } from "lodash";

import TenantContext from "coral-server/graph/context";
import {
  DSAReport,
  retrieveDSAReportConnection,
  retrieveManyDSAReports,
} from "coral-server/models/dsaReport";

import { QueryToDsaReportsArgs } from "coral-server/graph/schema/__generated__/types";

export default (ctx: TenantContext) => ({
  dsaReport: new DataLoader<string, DSAReport | null>(
    (ids) => retrieveManyDSAReports(ctx.mongo, ctx.tenant.id, ids),
    {
      cache: !ctx.disableCaching,
    }
  ),
  connection: ({ first, after }: QueryToDsaReportsArgs) =>
    retrieveDSAReportConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 20),
      after,
    }),
});
