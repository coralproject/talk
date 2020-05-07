import React, { Component } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";

import { DashboardLinkQuery as QueryTypes } from "coral-admin/__generated__/DashboardLinkQuery.graphql";

import DashboardLinkContainer from "./DashboardLinkContainer";

class DashboardLinkQuery extends Component {
  public render() {
    return (
      <QueryRenderer<QueryTypes>
        query={graphql`
          query DashboardLinkQuery {
            ...DashboardLinkContainer_query
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          }
          if (!props) {
            return <p>loading</p>;
          }

          return <DashboardLinkContainer query={props} />;
        }}
      />
    );
  }
}

export default DashboardLinkQuery;
