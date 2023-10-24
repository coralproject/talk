import React, { useCallback, useMemo, useState } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import MainLayout from "coral-admin/components/MainLayout";
import {
  useLoadMore,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLREPORT_SORT } from "coral-framework/schema";

import { ReportsTableContainer_query as QueryData } from "coral-admin/__generated__/ReportsTableContainer_query.graphql";
import { ReportsTableContainerPaginationQueryVariables } from "coral-admin/__generated__/ReportsTableContainerPaginationQuery.graphql";

import styles from "./ReportsTableContainer.css";

import ReportsSortMenu from "./ReportsSortMenu";
import ReportsTable from "./ReportsTable";

interface Props {
  query: QueryData | null;
  relay: RelayPaginationProp;
}

const ReportsTableContainer: React.FunctionComponent<Props> = (props) => {
  const [orderBy, setOrderBy] = useState<GQLREPORT_SORT>(
    GQLREPORT_SORT.CREATED_AT_DESC
  );

  const onSortChange = useCallback(
    (value: GQLREPORT_SORT) => {
      setOrderBy(value);
    },
    [setOrderBy]
  );

  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 10);
  const [, isRefetching] = useRefetch(props.relay, 10, {
    orderBy,
  });

  const dsaReports = useMemo(() => {
    return props.query
      ? props.query.dsaReports.edges.map((edge) => edge.node)
      : [];
  }, [props]);

  return (
    <MainLayout className={styles.root}>
      <ReportsSortMenu onChange={onSortChange} />
      <ReportsTable
        dsaReports={dsaReports}
        hasMore={!isRefetching && props.relay.hasMore()}
        disableLoadMore={isLoadingMore}
        onLoadMore={loadMore}
        loading={!props.query || isRefetching}
      />
    </MainLayout>
  );
};

type FragmentVariables = ReportsTableContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  ReportsTableContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment ReportsTableContainer_query on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "Cursor" }
        orderBy: { type: "REPORT_SORT", defaultValue: CREATED_AT_DESC }
      ) {
        dsaReports(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReportsTable_dsaReports") {
          edges {
            node {
              id
              ...ReportRowContainer_dsaReport
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.query && props.query.dsaReports;
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        orderBy: fragmentVariables.orderBy,
        cursor,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query ReportsTableContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $orderBy: REPORT_SORT
      ) {
        ...ReportsTableContainer_query
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    `,
  }
)(ReportsTableContainer);
export default enhanced;
