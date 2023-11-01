import React, { useCallback, useMemo, useState } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import MainLayout from "coral-admin/components/MainLayout";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  useLoadMore,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import {
  GQLDSAREPORT_STATUS_FILTER,
  GQLREPORT_SORT,
} from "coral-framework/schema";
import { Button, Flex } from "coral-ui/components/v2";

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
  const [statusFilter, setStatusFilter] = useState<
    GQLDSAREPORT_STATUS_FILTER[]
  >([
    GQLDSAREPORT_STATUS_FILTER.AWAITING_REVIEW,
    GQLDSAREPORT_STATUS_FILTER.UNDER_REVIEW,
  ]);
  const [filterButton, setFilterButton] = useState("completed");

  const onSortChange = useCallback(
    (value: GQLREPORT_SORT) => {
      setOrderBy(value);
    },
    [setOrderBy]
  );

  const onShowCompleted = useCallback(() => {
    setStatusFilter([
      GQLDSAREPORT_STATUS_FILTER.COMPLETED,
      GQLDSAREPORT_STATUS_FILTER.VOID,
    ]);
    setFilterButton("open");
  }, []);

  const onShowOpen = useCallback(() => {
    setStatusFilter([
      GQLDSAREPORT_STATUS_FILTER.AWAITING_REVIEW,
      GQLDSAREPORT_STATUS_FILTER.UNDER_REVIEW,
    ]);
    setFilterButton("completed");
  }, []);

  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 10);
  const [, isRefetching] = useRefetch(props.relay, 10, {
    orderBy,
    statusFilter,
  });

  const dsaReports = useMemo(() => {
    return props.query
      ? props.query.dsaReports.edges.map((edge) => edge.node)
      : [];
  }, [props]);

  return (
    <MainLayout className={styles.root}>
      <IntersectionProvider>
        <Flex>
          {/* TODO: Localize once confirmed with design */}
          {filterButton === "completed" ? (
            <Button
              className={styles.filterButton}
              onClick={onShowCompleted}
              variant="text"
              color="dark"
              uppercase={false}
            >
              Show closed reports
            </Button>
          ) : (
            <Button
              className={styles.filterButton}
              onClick={onShowOpen}
              variant="text"
              color="dark"
              uppercase={false}
            >
              Show open reports
            </Button>
          )}
          <ReportsSortMenu onChange={onSortChange} />
        </Flex>
        <ReportsTable
          dsaReports={dsaReports}
          hasMore={!isRefetching && props.relay.hasMore()}
          disableLoadMore={isLoadingMore}
          onLoadMore={loadMore}
          loading={!props.query || isRefetching}
        />
      </IntersectionProvider>
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
        statusFilter: {
          type: "[DSAREPORT_STATUS_FILTER!]"
          defaultValue: [AWAITING_REVIEW, UNDER_REVIEW]
        }
      ) {
        dsaReports(
          first: $count
          after: $cursor
          orderBy: $orderBy
          status: $statusFilter
        ) @connection(key: "ReportsTable_dsaReports") {
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
        statusFilter: fragmentVariables.statusFilter,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query ReportsTableContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $orderBy: REPORT_SORT
        $statusFilter: [DSAREPORT_STATUS_FILTER!]
      ) {
        ...ReportsTableContainer_query
          @arguments(
            count: $count
            cursor: $cursor
            orderBy: $orderBy
            statusFilter: $statusFilter
          )
      }
    `,
  }
)(ReportsTableContainer);
export default enhanced;
