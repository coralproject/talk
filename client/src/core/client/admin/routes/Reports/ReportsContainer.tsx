import React, { useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import MainLayout from "coral-admin/components/MainLayout";
import { withPaginationContainer } from "coral-framework/lib/relay";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import { ReportsContainer_query as QueryData } from "coral-admin/__generated__/ReportsContainer_query.graphql";
import { ReportsContainerPaginationQueryVariables } from "coral-admin/__generated__/ReportsContainerPaginationQuery.graphql";

import styles from "./ReportsContainer.css";

interface Props {
  query: QueryData | null;
  relay: RelayPaginationProp;
}
const ReportsContainer: React.FunctionComponent<Props> = (props) => {
  const dsaReports = useMemo(() => {
    return props.query
      ? props.query.dsaReports.edges.map((edge) => edge.node)
      : [];
  }, [props.query]);

  return (
    <MainLayout className={styles.root}>
      {/* TODO: Add sort by */}
      <Table fullWidth>
        <TableHead>
          {/* TODO: Need to localize all of these tableheads */}
          <TableRow>
            <TableCell>Report date</TableCell>
            <TableCell>Report age</TableCell>
            <TableCell>Reporter</TableCell>
            <TableCell>Report number</TableCell>
            <TableCell>Law broken</TableCell>
            <TableCell>Comment author</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dsaReports.map((report) => {
            return (
              <TableRow key={report.publicID}>
                <TableCell>{report.createdAt}</TableCell>
                <TableCell>Age TODO</TableCell>
                <TableCell>{report.reporter?.username}</TableCell>
                <TableCell>{report.publicID}</TableCell>
                <TableCell>{report.lawBrokenDescription}</TableCell>
                <TableCell>Comment author TODO</TableCell>
                <TableCell>{report.status}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </MainLayout>
  );
};

type FragmentVariables = ReportsContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  ReportsContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment ReportsContainer_query on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "Cursor" }
      ) {
        dsaReports(first: $count, after: $cursor)
          @connection(key: "DSAReportsConfig_dsaReports") {
          edges {
            node {
              id
              createdAt
              publicID
              status
              reporter {
                username
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
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query ReportsContainerPaginationQuery($count: Int!, $cursor: Cursor) {
        ...ReportsContainer_query @arguments(count: $count, cursor: $cursor)
      }
    `,
  }
)(ReportsContainer);
export default enhanced;
