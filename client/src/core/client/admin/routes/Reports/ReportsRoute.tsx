import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";

import { ReportsRouteQueryResponse } from "coral-admin/__generated__/ReportsRouteQuery.graphql";

import ReportsContainer from "./ReportsContainer";

interface Props {
  data: ReportsRouteQueryResponse | null;
}
const ReportsRoute: React.FunctionComponent<Props> = ({ data }) => {
  if (!data) {
    return null;
  }

  return <ReportsContainer query={data} />;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query ReportsRouteQuery {
      ...ReportsContainer_query
    }
  `,
})(ReportsRoute);

export default enhanced;
