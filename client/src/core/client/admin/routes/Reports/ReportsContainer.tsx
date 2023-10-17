import React, { useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { withPaginationContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { ReportsContainer_query as QueryData } from "coral-admin/__generated__/ReportsContainer_query.graphql";
import { ReportsContainerPaginationQueryVariables } from "coral-admin/__generated__/ReportsContainerPaginationQuery.graphql";

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
    <>
      {dsaReports.map((dsaReport) => {
        return (
          <HorizontalGutter key={dsaReport.publicID} spacing={2} marginTop={3}>
            <div>Report</div>
            <div>{dsaReport.publicID}</div>
            <div>{dsaReport.createdAt}</div>
            <div>{dsaReport.status}</div>
            <div>{dsaReport.lawBrokenDescription}</div>
          </HorizontalGutter>
        );
      })}
    </>
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
