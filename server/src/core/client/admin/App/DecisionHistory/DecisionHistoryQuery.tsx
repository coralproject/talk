import React, { Component } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

import { DecisionHistoryQuery as QueryTypes } from "coral-admin/__generated__/DecisionHistoryQuery.graphql";

import DecisionHistoryContainer from "./DecisionHistoryContainer";
import DecisionHistoryLoading from "./DecisionHistoryLoading";

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
            return <QueryError error={error} />;
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
