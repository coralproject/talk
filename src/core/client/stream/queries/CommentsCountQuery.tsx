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
    const { storyID, storyURL } = this.props.local;
    const { local: _, ...rest } = this.props;
    return (
      <QueryRenderer<QueryTypes>
        query={graphql`
          query CommentsCountQuery($storyID: ID, $storyURL: String) {
            story(id: $storyID, url: $storyURL) {
              commentCounts {
                totalVisible
              }
            }
          }
        `}
        variables={{
          storyID,
          storyURL,
        }}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          }

          if (props && props.story) {
            return (
              <CommentCountTab
                commentCount={props.story.commentCounts.totalVisible}
                {...rest}
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
      storyID
      storyURL
    }
  `
)(CommentsCountQuery);

export default enhanced;
