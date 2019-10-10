import React, { Component } from "react";

import { graphql, QueryRenderer } from "coral-framework/lib/relay";

import { ModerationActionBanQuery as QueryTypes } from "coral-stream/__generated__/ModerationActionBanQuery.graphql";

import ModerationActionBanContainer from "./ModerationActionBanContainer";

interface Props {
  onBan: () => void;
  userID: string;
}

export default class ModerationActionBanQuery extends Component<Props> {
  public render() {
    return (
      <QueryRenderer<QueryTypes>
        query={graphql`
          query ModerationActionBanQuery($userID: ID!) {
            user(id: $userID) {
              ...ModerationActionBanContainer_user
            }
          }
        `}
        dataFrom="STORE_THEN_NETWORK"
        variables={{
          userID: this.props.userID,
        }}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          }
          if (props && !props.user) {
            return null;
          }
          return (
            <ModerationActionBanContainer
              onBan={this.props.onBan}
              user={props ? props.user : null}
            />
          );
        }}
      />
    );
  }
}
