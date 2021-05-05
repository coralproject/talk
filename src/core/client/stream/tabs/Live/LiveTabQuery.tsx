import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { commitLocalUpdate, graphql } from "react-relay";
import { ConnectionHandler } from "relay-runtime";

import { waitFor } from "coral-common/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  deleteConnection,
  QueryRenderer,
  useLocal,
} from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";

import { LiveTabQuery } from "coral-stream/__generated__/LiveTabQuery.graphql";
import { LiveTabQueryLocal } from "coral-stream/__generated__/LiveTabQueryLocal.graphql";

import useOnResumeActive from "./helpers/useOnResumeActive";
import LiveStreamContainer from "./LiveStreamContainer";

import styles from "./LiveTabQuery.css";

interface PaginationState {
  cursor: string;
  inclusiveAfter: boolean;
  inclusiveBefore: boolean;
}

export interface SetCursorOptions {
  scrollToEnd?: boolean;
}

const LiveTabQuery: FunctionComponent = () => {
  const [
    {
      storyID,
      storyURL,
      liveChat: { currentCursor },
    },
    setLocal,
  ] = useLocal<LiveTabQueryLocal>(graphql`
    fragment LiveTabQueryLocal on Local {
      storyID
      storyURL
      liveChat {
        currentCursor
      }
    }
  `);
  const { localStorage } = useCoralContext();

  const [paginationState, setPaginationState] = useState<PaginationState>({
    cursor: "",
    inclusiveAfter: false,
    inclusiveBefore: true,
  });

  const { relayEnvironment } = useCoralContext();

  useEffect(() => {
    const loadCursor = async () => {
      // Now set the new cursor.
      const newCursor = currentCursor || new Date().toISOString();
      setPaginationState({
        cursor: newCursor,
        inclusiveAfter: false,
        inclusiveBefore: true,
      });
    };

    void loadCursor();
  }, [currentCursor, localStorage, storyID, storyURL]);

  // TODO: this is a possibly undesirable way to detect that
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
        if (data.error) {
          return <div className={styles.root}>{data.error.message}</div>;
        }
        if (!data || !data.props || !data.props.story) {
          return <div className={styles.root}></div>;
        }

        // The pagination container wouldn't allow us to start a new connection
        // by refetching with a different cursor. So we delete the connection first,
        // before starting the refetch.
        const deleteConnectionsAndSetCursor = async (
          s: string,
          options: SetCursorOptions | undefined = { scrollToEnd: true }
        ) => {
          // Setting empty cursor will trigger loading state and stops rendering any of the
          // pagination containers.
          setLocal({ liveChat: { currentCursor: "" } });
          setPaginationState({
            cursor: "",
            inclusiveAfter: true,
            inclusiveBefore: false,
          });

          // Wait for loading state to render.
          await waitFor(0);

          // Clear current connections, this will cause data to be stale and invalid,
          // no problems though, because we are in loading state and not rendering the
          // full tree.
          commitLocalUpdate(relayEnvironment, async (store) => {
            const storyRecord = store.get(data.props!.story!.id)!;

            const chatAfter = ConnectionHandler.getConnection(
              storyRecord,
              "Chat_after"
            );
            const chatBefore = ConnectionHandler.getConnection(
              storyRecord,
              "Chat_before"
            );

            if (chatBefore) {
              deleteConnection(store, chatBefore.getDataID());
            }
            if (chatAfter) {
              deleteConnection(store, chatAfter.getDataID());
            }
          });

          // Now reload with a new cursor.
          setLocal({ liveChat: { currentCursor: s } });
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
