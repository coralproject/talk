import React, { Component } from "react";
import {
  graphql,
  QueryRenderer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { CommentsCountQuery as QueryTypes } from "talk-stream/__generated__/CommentsCountQuery.graphql";
import { CommentsCountQueryLocal as Local } from "talk-stream/__generated__/CommentsCountQueryLocal.graphql";
import { Spinner } from "talk-ui/components";
import { Tab } from "talk-ui/components";
import { PropTypesOf } from "talk-ui/types";
import CommentCountTab from "../components/CommentCountTab";

interface InnerProps extends PropTypesOf<typeof Tab> {
  local: Local;
}

class CommentsCountQuery extends Component<InnerProps> {
  public render() {
    const { assetID, assetURL } = this.props.local;
    return (
      <QueryRenderer<QueryTypes>
        query={graphql`
          query CommentsCountQuery($assetID: ID, $assetURL: String) {
            asset(id: $assetID, url: $assetURL) {
              commentCounts {
                totalVisible
              }
            }
          }
        `}
        variables={{
          assetID,
          assetURL,
        }}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          }

          if (props && props.asset && props.asset.commentCounts.totalVisible) {
            return (
              <CommentCountTab
                commentCount={props.asset.commentCounts.totalVisible}
                {...this.props}
              />
            );
          }

          return <Spinner />;
        }}
      />
    );
  }
}

const enhanced = withLocalStateContainer(
  graphql`
    fragment CommentsCountQueryLocal on Local {
      assetID
      assetURL
    }
  `
)(CommentsCountQuery);

export default enhanced;
