import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { QueryRenderer, useLocal } from "coral-framework/lib/relay";

import { LiveTabQuery } from "coral-stream/__generated__/LiveTabQuery.graphql";
import { LiveTabQueryLocal } from "coral-stream/__generated__/LiveTabQueryLocal.graphql";

import LiveStreamContainer from "./LiveStreamContainer";

const LiveTabQuery: FunctionComponent = () => {
  const [{ storyID, storyURL }] = useLocal<LiveTabQueryLocal>(graphql`
    fragment LiveTabQueryLocal on Local {
      storyID
      storyURL
    }
  `);

  const cursor = useMemo(() => {
    return new Date().toISOString();
  }, []);

  if (!storyURL) {
    return null;
  }

  return (
    <QueryRenderer<LiveTabQuery>
      query={graphql`
        query LiveTabQuery($storyID: ID, $storyURL: String!, $cursor: Cursor) {
          viewer {
            ...LiveStreamContainer_viewer
          }
          settings {
            ...LiveStreamContainer_settings
          }
          story: stream(id: $storyID, url: $storyURL) {
            id
            ...LiveStreamContainer_story @arguments(cursor: $cursor)
          }
        }
      `}
      variables={{
        storyID,
        storyURL,
        cursor,
      }}
      render={(data) => {
        if (!data || !data.props || !data.props.story) {
          return null;
        }

        return (
          <LiveStreamContainer
            story={data.props.story}
            viewer={data.props.viewer}
            settings={data.props.settings}
            cursor={cursor}
          />
        );
      }}
    />
  );
};

export default LiveTabQuery;
