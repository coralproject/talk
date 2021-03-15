import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { QueryRenderer, useLocal } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";

import { LiveTabQuery } from "coral-stream/__generated__/LiveTabQuery.graphql";
import { LiveTabQueryLocal } from "coral-stream/__generated__/LiveTabQueryLocal.graphql";

import CursorState from "./cursorState";
import LiveStreamContainer from "./LiveStreamContainer";
import useOnResumeActive from "./useOnResumeActive";

const LiveTabQuery: FunctionComponent = () => {
  const [{ storyID, storyURL }] = useLocal<LiveTabQueryLocal>(graphql`
    fragment LiveTabQueryLocal on Local {
      storyID
      storyURL
    }
  `);
  const context = useCoralContext();

  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorWasSet, setCursorWasSet] = useState<boolean>(false);

  useEffect(() => {
    const loadCursor = async () => {
      const key = `liveCursor:${storyID}:${storyURL}`;

      const rawValue = await context.localStorage.getItem(key);
      let current: CursorState | null = null;
      if (rawValue) {
        current = JSON.parse(rawValue);
      }

      if (
        current &&
        current.cursor !== undefined &&
        current.cursor !== null &&
        current.cursor !== ""
      ) {
        setCursor(current.cursor);
        setCursorWasSet(true);
      } else {
        // TODO (Nick): we probably want to not set a cursor
        // directly like this.
        setCursor(new Date().toISOString());
      }
    };

    void loadCursor();
  }, [context.localStorage, storyID, storyURL, setCursorWasSet]);

  const updateCursor = useCallback(
    (c: string) => {
      if (!c) {
        return;
      }

      setCursor(c);
    },
    [setCursor]
  );

  // this is a possibly undesirable way to detect that
  // the page has come back from sleeping (likely due to
  // mobile phone locking and unlocking). We will want to
  // look into some more optimal solutions that detect when
  // we have re-awakened our running javascript environment
  // and correctly refresh the query using relay and any
  // underlying socket connections instead of just brute
  // forcing the whole iframe reload.
  const reload = useCallback(() => {
    window.location.reload();
  }, []);
  useOnResumeActive(reload, {
    intervalMs: 500,
    thresholdMs: 8000,
  });

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
            cursorSet={cursorWasSet}
            setCursor={updateCursor}
          />
        );
      }}
    />
  );
};

export default LiveTabQuery;
