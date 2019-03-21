import React, { Component } from "react";
import { graphql, QueryRenderer } from "talk-framework/lib/relay";

import { DecisionHistoryQuery as QueryTypes } from "talk-admin/__generated__/DecisionHistoryQuery.graphql";

import DecisionHistoryLoading from "../components/DecisionHistoryLoading";
import DecisionHistoryContainer from "../containers/DecisionHistoryContainer";

interface Props {
  onClosePopover: () => void;
}

class DecisionHistoryQuery extends Component<Props> {
  public render() {
    return (
      <QueryRenderer<QueryTypes>
        query={graphql`
          query DecisionHistoryQuery {
            viewer {
              ...DecisionHistoryContainer_viewer
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          }
          if (!props || !props.viewer) {
            return <DecisionHistoryLoading />;
          }

          return (
            <DecisionHistoryContainer
              viewer={props.viewer}
              onClosePopover={this.props.onClosePopover}
            />
          );
        }}
      />
    );
  }
}

export default DecisionHistoryQuery;
