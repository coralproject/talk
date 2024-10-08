import DataLoader from "dataloader";
import { defaultTo } from "lodash";

import {
  DSAReportConnectionInput,
  find,
  retrieveDSAReportConnection,
  retrieveDSAReportRelatedReportsConnection,
} from "coral-server/models/dsaReport";

import GraphContext from "../context";
import { createManyBatchLoadFn } from "./util";

import {
  DSAReportToRelatedReportsArgs,
  GQLDSAREPORT_STATUS_FILTER,
  GQLDSAReportStatus,
  GQLREPORT_SORT,
  QueryToDsaReportsArgs,
} from "coral-server/graph/schema/__generated__/types";

type DSAReportConnectionFilterInput = DSAReportConnectionInput["filter"];

export interface FindDSAReportInput {
  id: string;
}

const convertStatusEnum = (
  status: GQLDSAREPORT_STATUS_FILTER
): GQLDSAReportStatus => {
  if (status === GQLDSAREPORT_STATUS_FILTER.AWAITING_REVIEW) {
    return GQLDSAReportStatus.AWAITING_REVIEW;
  }
  if (status === GQLDSAREPORT_STATUS_FILTER.COMPLETED) {
    return GQLDSAReportStatus.COMPLETED;
  }
  if (status === GQLDSAREPORT_STATUS_FILTER.UNDER_REVIEW) {
    return GQLDSAReportStatus.UNDER_REVIEW;
  }
  if (status === GQLDSAREPORT_STATUS_FILTER.VOID) {
    return GQLDSAReportStatus.VOID;
  }

  return GQLDSAReportStatus.VOID;
};

const statusFilter = (
  status?: GQLDSAREPORT_STATUS_FILTER[]
): DSAReportConnectionFilterInput => {
  if (status) {
    const inStatus = status.map((s) => convertStatusEnum(s));

    return {
      status: { $in: inStatus },
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
  relatedReports: (
    submissionID: string,
    id: string,
    { first, orderBy, after }: DSAReportToRelatedReportsArgs
  ) =>
    retrieveDSAReportRelatedReportsConnection(
      ctx.mongo,
      ctx.tenant.id,
      submissionID,
      id,
      {
        first: defaultTo(first, 10),
        orderBy: defaultTo(orderBy, GQLREPORT_SORT.CREATED_AT_DESC),
        after,
      }
    ),
});
