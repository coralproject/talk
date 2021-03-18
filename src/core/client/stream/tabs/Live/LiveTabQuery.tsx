import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { commitLocalUpdate, graphql } from "react-relay";
import { ConnectionHandler } from "relay-runtime";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { QueryRenderer, useLocal } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";

import { LiveTabQuery } from "coral-stream/__generated__/LiveTabQuery.graphql";
import { LiveTabQueryLocal } from "coral-stream/__generated__/LiveTabQueryLocal.graphql";

import CursorState from "./cursorState";
import LiveStreamContainer from "./LiveStreamContainer";
import useOnResumeActive from "./useOnResumeActive";

interface PaginationState {
  cursor: string;
  inclusiveAfter: boolean;
  inclusiveBefore: boolean;
}

const LiveTabQuery: FunctionComponent = () => {
  const [{ storyID, storyURL }] = useLocal<LiveTabQueryLocal>(graphql`
    fragment LiveTabQueryLocal on Local {
      storyID
      storyURL
    }
  `);
  const context = useCoralContext();

  const [paginationState, setPaginationState] = useState<PaginationState>({
    cursor: "",
    inclusiveAfter: false,
    inclusiveBefore: true,
  });

  useEffect(() => {
    const loadCursor = async () => {
      const key = `liveCursor:${storyID}:${storyURL}`;

      const rawValue = await context.sessionStorage.getItem(key);
      let current: CursorState | null = null;
      if (rawValue) {
        current = JSON.parse(rawValue);
      }

      const newCursor = current?.cursor || new Date().toISOString();
      setPaginationState({
        cursor: newCursor,
        inclusiveAfter: false,
        inclusiveBefore: true,
      });
    };

    void loadCursor();
  }, [context.sessionStorage, storyID, storyURL]);

  const { relayEnvironment } = useCoralContext();

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

  if (!paginationState.cursor) {
    return <Spinner />;
  }

  return (
    <QueryRenderer<LiveTabQuery>
      query={graphql`
        query LiveTabQuery(
          $storyID: ID
          $storyURL: String!
          $cursor: Cursor
          $inclusiveBefore: Boolean!
          $inclusiveAfter: Boolean!
        ) {
          viewer {
            ...LiveStreamContainer_viewer
          }
          settings {
            ...LiveStreamContainer_settings
          }
          story: stream(id: $storyID, url: $storyURL) {
            id
            ...LiveStreamContainer_story
              @arguments(
                cursor: $cursor
                inclusiveBefore: $inclusiveBefore
                inclusiveAfter: $inclusiveAfter
              )
          }
        }
      `}
      variables={{
        storyID,
        storyURL,
        cursor: paginationState.cursor,
        inclusiveBefore: paginationState.inclusiveBefore,
        inclusiveAfter: paginationState.inclusiveAfter,
      }}
      render={(data) => {
        if (!data || !data.props || !data.props.story) {
          return null;
        }

        // The pagination container wouldn't allow us to start a new connection
        // by refetching with a different cursor. So we delete the connection first,
        // before starting the refetch.
        const deleteConnectionsAndSetCursor = (s: string) => {
          commitLocalUpdate(relayEnvironment, (store) => {
            // TODO: (cvle) use `getConnectionID` after update:
            // https://github.com/facebook/relay/pull/3332
            const storyRecord = store.get(data.props!.story!.id)!;
            const chatAfter = ConnectionHandler.getConnection(
              storyRecord,
              "Chat_after"
            )!;
            const chatBefore = ConnectionHandler.getConnection(
              storyRecord,
              "Chat_before"
            )!;
            store.delete(chatAfter.getValue("__id") as string);
            store.delete(chatBefore.getValue("__id") as string);
          });
          setPaginationState({
            cursor: s,
            inclusiveAfter: true,
            inclusiveBefore: false,
          });
        };

        return (
          <LiveStreamContainer
            story={data.props.story}
            viewer={data.props.viewer}
            settings={data.props.settings}
            cursor={paginationState.cursor}
            setCursor={deleteConnectionsAndSetCursor}
          />
        );
      }}
    />
  );
};

export default LiveTabQuery;
