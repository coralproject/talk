import { useRouter } from "found";
import React, { useCallback, useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { useDateTimeFormatter } from "coral-framework/hooks";
import { withPaginationContainer } from "coral-framework/lib/relay";
import { GQLREPORT_SORT } from "coral-framework/schema";
import { RelativeTime, TableCell, TableRow } from "coral-ui/components/v2";

import { ReportsRowContainer_query as QueryData } from "coral-admin/__generated__/ReportsRowContainer_query.graphql";
import { ReportsRowContainerPaginationQueryVariables } from "coral-admin/__generated__/ReportsRowContainerPaginationQuery.graphql";

interface Props {
  query: QueryData | null;
  relay: RelayPaginationProp;
  orderBy: GQLREPORT_SORT;
}

const ReportsRowContainer: React.FunctionComponent<Props> = (props) => {
  const dsaReports = useMemo(() => {
    return props.query
      ? props.query.dsaReports.edges.map((edge) => edge.node)
      : [];
  }, [props.query]);

  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const { router } = useRouter();

  const onReportRowClick = useCallback(
    (reportID: string) => {
      router.replace(`/admin/reports/report/${reportID}`);
    },
    [router]
  );

  return (
    <>
      {dsaReports.map((report) => {
        return (
          <TableRow
            key={report.referenceID}
            onClick={() => onReportRowClick(report.id)}
          >
            <TableCell>{formatter(report.createdAt)}</TableCell>
            <TableCell>
              <RelativeTime date={report.createdAt} />
            </TableCell>
            <TableCell>{report.reporter?.username}</TableCell>
            <TableCell>{report.referenceID}</TableCell>
            <TableCell>{report.lawBrokenDescription}</TableCell>
            <TableCell>{report.comment?.author?.username}</TableCell>
            <TableCell>{report.status}</TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

type FragmentVariables = ReportsRowContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  ReportsRowContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment ReportsRowContainer_query on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "Cursor" }
        orderBy: { type: "REPORT_SORT", defaultValue: CREATED_AT_DESC }
      ) {
        dsaReports(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "DSAReportsConfig_dsaReports") {
          edges {
            node {
              id
              createdAt
              referenceID
              status
              reporter {
                username
              }
              comment {
                author {
                  username
                }
              }
              lawBrokenDescription
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
    getVariables({ orderBy }, { count, cursor }, fragmentVariables) {
      return {
        count,
        orderBy,
        cursor,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query ReportsRowContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $orderBy: REPORT_SORT
      ) {
        ...ReportsRowContainer_query
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    `,
  }
)(ReportsRowContainer);
export default enhanced;
