import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLocal,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import Spinner from "coral-stream/common/Spinner";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { GQLDSA_METHOD_OF_REDRESS } from "coral-common/client/src/core/client/framework/schema/__generated__/types";
import { NotificationsPaginator_query } from "coral-stream/__generated__/NotificationsPaginator_query.graphql";
import { NotificationsPaginatorPaginationQueryVariables } from "coral-stream/__generated__/NotificationsPaginatorPaginationQuery.graphql";

import { NotificationsPaginatorLocal } from "coral-stream/__generated__/NotificationsPaginatorLocal.graphql";

import NotificationContainer from "./NotificationContainer";

import styles from "./NotificationsPaginator.css";

interface Props {
  query: NotificationsPaginator_query;
  relay: RelayPaginationProp;
  viewerID: string;
}

const NotificationsPaginator: FunctionComponent<Props> = (props) => {
  const [disableLoadMore, setDisableLoadMore] = useState(false);

  const [{ activeTab, profileTab }, setLocal] =
    useLocal<NotificationsPaginatorLocal>(graphql`
      fragment NotificationsPaginatorLocal on Local {
        activeTab
        profileTab
      }
    `);

  const onPreferencesClick = useCallback(() => {
    setLocal({ activeTab: "PROFILE" });
    setLocal({ profileTab: "PREFERENCES" });
  }, [activeTab, profileTab, setLocal]);

  const [, isRefetching] =
    useRefetch<NotificationsPaginatorPaginationQueryVariables>(
      props.relay,
      10,
      { viewerID: props.viewerID }
    );

  const loadMore = useCallback(() => {
    if (!props.relay.hasMore() || props.relay.isLoading()) {
      return;
    }

    setDisableLoadMore(true);

    props.relay.loadMore(
      10, // Fetch the next 10 feed items
      (error: any) => {
        setDisableLoadMore(false);

        if (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    );
  }, [props.relay]);

  if (!props.query || !props.query.viewer) {
    return null;
  }

  if (props.query.notifications.edges.length === 0) {
    return (
      <div className={styles.none}>
        <Localized id="notifications-youDoNotCurrentlyHaveAny">
          You do not currently have any notifications
        </Localized>
      </div>
    );
  }

  return (
    <>
      {props.query.settings.dsa.enabled && (
        <div className={styles.methodOfRedress}>
          {props.query.settings.dsa.methodOfRedress.method ===
            GQLDSA_METHOD_OF_REDRESS.NONE && (
            <Localized id="notifications-methodOfRedress-none">
              All moderation decisions are final and cannot be appealed
            </Localized>
          )}
          {props.query.settings.dsa.methodOfRedress.method ===
            GQLDSA_METHOD_OF_REDRESS.EMAIL && (
            <Localized
              id="notifications-methodOfRedress-email"
              vars={{
                email: props.query.settings.dsa.methodOfRedress.email,
              }}
              elems={{
                a: (
                  <a
                    href={`mailto: ${props.query.settings.dsa.methodOfRedress.email}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {props.query.settings.dsa.methodOfRedress.email}
                  </a>
                ),
              }}
            >
              <span>{`To appeal a decision that appears here please contact ${props.query.settings.dsa.methodOfRedress.email}`}</span>
            </Localized>
          )}
          {props.query.settings.dsa.methodOfRedress.method ===
            GQLDSA_METHOD_OF_REDRESS.URL && (
            <Localized
              id="notifications-methodOfRedress-url"
              vars={{
                url: props.query.settings.dsa.methodOfRedress.url,
              }}
              elems={{
                a: (
                  <a
                    href={`${props.query.settings.dsa.methodOfRedress.url}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {props.query.settings.dsa.methodOfRedress.url}
                  </a>
                ),
              }}
            >
              <span>{`To appeal a decision that appears here please visit ${props.query.settings.dsa.methodOfRedress.url}`}</span>
            </Localized>
          )}
        </div>
      )}
      <Localized
        id="notifications-adjustPreferences"
        elems={{
          button: (
            <Button
              className={styles.preferencesButton}
              variant="none"
              onClick={onPreferencesClick}
            >
              {" "}
              Preferences.
            </Button>
          ),
        }}
      >
        <Flex className={styles.adjustPreferences}>
          <span>Adjust notification settings in My Profile &gt; </span>
          <Button
            className={styles.preferencesButton}
            variant="none"
            onClick={onPreferencesClick}
          >
            {" "}
            Preferences.
          </Button>
        </Flex>
      </Localized>
      <div>
        {props.query.notifications.edges.map(({ node }) => {
          return (
            <NotificationContainer
              key={node.id}
              notification={node}
              viewer={props.query.viewer}
            />
          );
        })}
        {isRefetching && <Spinner />}
        {!isRefetching && !disableLoadMore && props.relay.hasMore() && (
          <Localized id="notifications-loadMore">
            <Button
              key={props.query.notifications.edges.length}
              onClick={loadMore}
              variant="outlined"
              color="secondary"
              fullWidth
              disabled={disableLoadMore}
              aria-controls="notifications-loadMore"
              className={CLASSES.tabBarNotifications.loadMore}
            >
              Load More
            </Button>
          </Localized>
        )}
      </div>
    </>
  );
};

type FragmentVariables = NotificationsPaginatorPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  NotificationsPaginatorPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment NotificationsPaginator_query on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "Cursor" }
        viewerID: { type: "ID!" }
      ) {
        viewer {
          ...NotificationContainer_viewer
        }
        settings {
          dsa {
            enabled
            methodOfRedress {
              method
              email
              url
            }
          }
        }
        notifications(ownerID: $viewerID, after: $cursor, first: $count)
          @connection(key: "NotificationsPaginator_notifications") {
          edges {
            node {
              id
              ...NotificationContainer_notification
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.query && props.query.notifications;
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
        viewerID: props.viewerID,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query NotificationsPaginatorPaginationQuery(
        $viewerID: ID!
        $cursor: Cursor
        $count: Int!
      ) {
        ...NotificationsPaginator_query
          @arguments(viewerID: $viewerID, count: $count, cursor: $cursor)
      }
    `,
  }
)(NotificationsPaginator);

export default enhanced;
