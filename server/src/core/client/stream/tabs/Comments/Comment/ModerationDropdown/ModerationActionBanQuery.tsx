import React, { Component } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

import { ModerationActionBanQuery as QueryTypes } from "coral-stream/__generated__/ModerationActionBanQuery.graphql";

import ModerationActionBanContainer from "./ModerationActionBanContainer";

interface Props {
  onBan: () => void;
  onSiteBan: () => void;
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
            settings {
              ...ModerationActionBanContainer_settings
            }
            story {
              ...ModerationActionBanContainer_story
            }
            viewer {
              ...ModerationActionBanContainer_viewer
            }
          }
        `}
        fetchPolicy="store-and-network"
        variables={{
          userID: this.props.userID,
        }}
        render={({ error, props }) => {
          if (error) {
            return <QueryError error={error} />;
          }
          if (props && !props.user) {
            return null;
          }
          return (
            <ModerationActionBanContainer
              onBan={this.props.onBan}
              onSiteBan={this.props.onSiteBan}
              user={props ? props.user : null}
              settings={props ? props.settings : null}
              story={props ? props.story : null}
              viewer={props ? props.viewer : null}
            />
          );
        }}
      />
    );
  }
}
