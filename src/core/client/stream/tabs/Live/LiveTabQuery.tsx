import React, { FunctionComponent, useEffect, useState } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { QueryRenderer, useLocal } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";

import { LiveTabQuery } from "coral-stream/__generated__/LiveTabQuery.graphql";
import { LiveTabQueryLocal } from "coral-stream/__generated__/LiveTabQueryLocal.graphql";

import CursorState from "./CursorState";
import LiveStreamContainer from "./LiveStreamContainer";

const LiveTabQuery: FunctionComponent = () => {
  const [{ storyID, storyURL }] = useLocal<LiveTabQueryLocal>(graphql`
    fragment LiveTabQueryLocal on Local {
      storyID
      storyURL
    }
  `);
  const context = useCoralContext();

  const [cursor, setCursor] = useState<string | null>(null);

  useEffect(() => {
    const loadCursor = async () => {
      const key = `liveCursor:${storyID}:${storyURL}`;

      const rawValue = await context.localStorage.getItem(key);
      let current: CursorState | null = null;
      if (rawValue) {
        current = JSON.parse(rawValue);
      }

      if (current) {
        setCursor(new Date(current.cursor).toISOString());
      } else {
        setCursor(new Date().toISOString());
      }
    };

    void loadCursor();
  }, [context.localStorage, storyID, storyURL]);

  if (!storyURL) {
    return null;
  }

  if (!cursor) {
    return <Spinner />;
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
