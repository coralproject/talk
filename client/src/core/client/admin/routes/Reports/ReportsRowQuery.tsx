import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { GQLREPORT_SORT } from "coral-framework/schema";
import { Flex, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { ReportsRowQuery as QueryTypes } from "coral-admin/__generated__/ReportsRowQuery.graphql";

import ReportsRowContainer from "./ReportsRowContainer";

interface Props {
  orderBy: GQLREPORT_SORT;
}

const ReportsRowQuery: FunctionComponent<Props> = ({ orderBy }) => (
  <QueryRenderer<QueryTypes>
    query={graphql`
      query ReportsRowQuery($orderBy: REPORT_SORT) {
        ...ReportsRowContainer_query @arguments(orderBy: $orderBy)
      }
    `}
    cacheConfig={{ force: true }}
    variables={{
      orderBy,
    }}
    render={({ error, props }: any) => {
      if (error) {
        return <QueryError error={error} />;
      }
      if (!props) {
        return (
          <Flex justifyContent="center">
            <Spinner />
          </Flex>
        );
      }

      return <ReportsRowContainer query={props} orderBy={orderBy} />;
    }}
  />
);

export default ReportsRowQuery;
