import React, { Component } from "react";
import { graphql, QueryRenderer } from "talk-framework/lib/relay";

import { DecisionHistoryQuery as QueryTypes } from "talk-admin/__generated__/DecisionHistoryQuery.graphql";

import DecisionHistoryLoading from "../components/DecisionHistoryLoading";
import DecisionHistoryContainer from "../containers/DecisionHistoryContainer";

class DecisionHistoryQuery extends Component {
  public render() {
    return (
      <QueryRenderer<QueryTypes>
        query={graphql`
          query DecisionHistoryQuery {
            me {
              ...DecisionHistoryContainer_me
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          }
          if (!props || !props.me) {
            return <DecisionHistoryLoading />;
          }

          return <DecisionHistoryContainer me={props.me} />;
        }}
      />
    );
  }
}

export default DecisionHistoryQuery;
