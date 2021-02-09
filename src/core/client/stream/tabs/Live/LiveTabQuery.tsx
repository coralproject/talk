import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer, useLocal } from "coral-framework/lib/relay";

import { LiveTabQuery } from "coral-stream/__generated__/LiveTabQuery.graphql";
import { LiveTabQueryLocal } from "coral-stream/__generated__/LiveTabQueryLocal.graphql";

import LiveStream from "./LiveStream";

const LiveTabQuery: FunctionComponent = () => {
  const [{ storyID, storyURL, storyMode }] = useLocal<
    LiveTabQueryLocal
  >(graphql`
    fragment LiveTabQueryLocal on Local {
      storyID
      storyURL
      storyMode
    }
  `);

  return (
    <QueryRenderer<LiveTabQuery>
      query={graphql`
        query LiveTabQuery(
          $storyID: ID
          $storyURL: String
          $storyMode: STORY_MODE
        ) {
          viewer {
            ...LiveStreamContainer_viewer
          }
          settings {
            ...LiveStreamContainer_settings
          }
          story: stream(id: $storyID, url: $storyURL, mode: $storyMode) {
            id
            comments(first: 20, orderBy: CREATED_AT_DESC) {
              edges {
                node {
                  ...LiveCommentContainer_comment
                }
              }
            }
          }
        }
      `}
      variables={{
        storyID,
        storyURL,
        storyMode,
      }}
      render={(data) => {
        if (!data || !data.props || !data.props.story) {
          return null;
        }

        const comments = data.props.story.comments.edges.map((e) => {
          return e.node;
        });

        return (
          <LiveStream
            comments={comments}
            viewer={data.props.viewer}
            settings={data.props.settings}
          />
        );
      }}
    />
  );
};

export default LiveTabQuery;
