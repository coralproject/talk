import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useEffect } from "react";
import { graphql, GraphQLTaggedNode, RelayPaginationProp } from "react-relay";

import { SectionFilter } from "coral-common/section";
import parseModerationOptions from "coral-framework/helpers/parseModerationOptions";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  LOCAL_ID,
  lookup,
  useLoadMore,
  useLocal,
  useMutation,
  useRefetch,
  useSubscription,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { GQLCOMMENT_SORT, GQLMODERATION_QUEUE } from "coral-framework/schema";
import { Spinner } from "coral-ui/components/v2";

import { QueueRoute_queue } from "coral-admin/__generated__/QueueRoute_queue.graphql";
import { QueueRoute_settings } from "coral-admin/__generated__/QueueRoute_settings.graphql";
import { QueueRoute_viewer } from "coral-admin/__generated__/QueueRoute_viewer.graphql";
import { QueueRouteLocal } from "coral-admin/__generated__/QueueRouteLocal.graphql";
import { QueueRoutePaginationPendingQueryVariables } from "coral-admin/__generated__/QueueRoutePaginationPendingQuery.graphql";
import { QueueRoutePaginationReportedQueryVariables } from "coral-admin/__generated__/QueueRoutePaginationReportedQuery.graphql";
import { QueueRoutePaginationUnmoderatedQueryVariables } from "coral-admin/__generated__/QueueRoutePaginationUnmoderatedQuery.graphql";

import EmptyMessage from "./EmptyMessage";
import LoadingQueue from "./LoadingQueue";
import Queue from "./Queue";
import QueueCommentEnteredSubscription from "./QueueCommentEnteredSubscription";
import QueueCommentLeftSubscription from "./QueueCommentLeftSubscription";
import QueueViewNewMutation from "./QueueViewNewMutation";

interface Props {
  isLoading: boolean;
  queueName: GQLMODERATION_QUEUE;
  queue: QueueRoute_queue | null;
  settings: QueueRoute_settings | null;
  viewer: QueueRoute_viewer | null;
  relay: RelayPaginationProp;
  emptyElement: React.ReactElement;
  storyID?: string | null;
  siteID?: string | null;
  section?: SectionFilter | null;
  orderBy?: GQLCOMMENT_SORT;
}

// TODO: use generated types
const danglingLogic = (status: string) =>
  ["APPROVED", "REJECTED"].includes(status);

export const QueueRoute: FunctionComponent<Props> = ({
  isLoading,
  queueName,
  queue,
  settings,
  viewer,
  relay,
  emptyElement,
  storyID = null,
  siteID = null,
  section,
}) => {
  const [{ moderationQueueSort }] = useLocal<QueueRouteLocal>(graphql`
    fragment QueueRouteLocal on Local {
      moderationQueueSort
    }
  `);

  const [, isRefetching] = useRefetch<
    | QueueRoutePaginationPendingQueryVariables
    | QueueRoutePaginationReportedQueryVariables
    | QueueRoutePaginationUnmoderatedQueryVariables
  >(relay, 5, {
    orderBy: moderationQueueSort,
  });

  const orderBy = moderationQueueSort as GQLCOMMENT_SORT;
  const [loadMore, isLoadingMore] = useLoadMore(relay, 10);
  const viewNew = useMutation(QueueViewNewMutation);
  const onViewNew = useCallback(() => {
    void viewNew({
      queue: queueName,
      storyID,
      siteID,
      section,
      orderBy,
    });
  }, [viewNew, queueName, storyID, siteID, section, orderBy]);

  const subscribeToQueueCommentEntered = useSubscription(
    QueueCommentEnteredSubscription
  );
  const subscribeToQueueCommentLeft = useSubscription(
    QueueCommentLeftSubscription
  );

  const hasMore = relay.hasMore();

  // Handle subscribing/unsubscribe comment left
  useEffect(() => {
    const commentLeftSub = subscribeToQueueCommentLeft({
      queue: queueName,
      storyID,
      siteID,
      orderBy,
      section,
    });

    return () => {
      commentLeftSub.dispose();
    };
  }, [
    orderBy,
    queueName,
    section,
    siteID,
    storyID,
    subscribeToQueueCommentLeft,
  ]);

  // Handle subscribing/unsubscribe comment entered
  useEffect(() => {
    switch (orderBy) {
      case GQLCOMMENT_SORT.CREATED_AT_ASC:
        // Oldest first when there is more than one page of content can't
        // possibly have new comments to show in view!
        if (hasMore) {
          return;
        }

        // We have all the comments for this story in view! Comments could load!
        break;
      case GQLCOMMENT_SORT.CREATED_AT_DESC:
        // Newest first can always get more comments in view.
        break;
      default:
        // Only chronological sort supports top level live updates of incoming
        // comments.
        return;
    }

    const commentEnteredSub = subscribeToQueueCommentEntered({
      queue: queueName,
      storyID,
      siteID,
      orderBy,
      section,
    });

    return () => {
      commentEnteredSub.dispose();
    };
  }, [
    subscribeToQueueCommentEntered,
    hasMore,
    orderBy,
    queueName,
    storyID,
    siteID,
    section,
  ]);

  // It's never the case really that the query has loaded but queue or settings
  // is null, but this was to appease the type system.
  if (isLoading || !queue || !settings || !viewer) {
    return <LoadingQueue />;
  }

  const comments = queue.comments.edges.map((edge) => edge.node);

  const viewNewCount =
    (queue.comments.viewNewEdges && queue.comments.viewNewEdges.length) || 0;

  if (isRefetching) {
    // TODO (Nick): make sure this doesn't clash with styles
    return <Spinner />;
  }

  return (
    <IntersectionProvider>
      <Queue
        comments={comments}
        settings={settings}
        viewer={viewer}
        onLoadMore={loadMore}
        hasLoadMore={relay.hasMore()}
        disableLoadMore={isLoadingMore}
        danglingLogic={danglingLogic}
        emptyElement={emptyElement}
        showStoryInfo={!storyID}
        viewNewCount={viewNewCount}
        onViewNew={onViewNew}
      />
    </IntersectionProvider>
  );
};

// TODO: (cvle) If this could be autogenerated..
type FragmentVariables = QueueRoutePaginationPendingQueryVariables;

const createQueueRoute = (
  queueName: GQLMODERATION_QUEUE,
  queueQuery: GraphQLTaggedNode,
  paginationQuery: GraphQLTaggedNode,
  emptyElement: React.ReactElement
) => {
  const enhanced = withRouteConfig<Props, any>({
    prepareVariables: (params, match) => {
      const initialOrderBy = lookup(
        match.context.relayEnvironment,
        LOCAL_ID
      )!.moderationQueueSort;
      return {
        ...params,
        initialOrderBy,
      };
    },
    query: queueQuery,
    cacheConfig: { force: true },
    render: function QueueRouteRender({ Component, data, match }) {
      if (!Component) {
        throw new Error("Missing component");
      }

      const { storyID, siteID, section } = parseModerationOptions(match);
      if (!data) {
        return (
          <Component
            isLoading
            queueName={queueName}
            queue={null}
            settings={null}
            viewer={null}
            emptyElement={emptyElement}
            storyID={storyID}
            siteID={siteID}
            section={section}
          />
        );
      }

      const queue =
        data.moderationQueues[Object.keys(data.moderationQueues)[0]];

      return (
        <Component
          isLoading={false}
          queueName={queueName}
          queue={queue}
          settings={data.settings}
          viewer={data.viewer}
          emptyElement={emptyElement}
          storyID={storyID}
          siteID={siteID}
          section={section}
        />
      );
    },
  })(
    withPaginationContainer<
      Props,
      QueueRoutePaginationPendingQueryVariables,
      FragmentVariables
    >(
      {
        queue: graphql`
          fragment QueueRoute_queue on ModerationQueue
          @argumentDefinitions(
            count: { type: "Int", defaultValue: 5 }
            cursor: { type: "Cursor" }
            orderBy: { type: "COMMENT_SORT", defaultValue: CREATED_AT_DESC }
          ) {
            count
            comments(first: $count, after: $cursor, orderBy: $orderBy)
              @connection(key: "Queue_comments") {
              viewNewEdges {
                cursor
                node {
                  id
                  ...ModerateCardContainer_comment
                }
              }
              edges {
                node {
                  id
                  ...ModerateCardContainer_comment
                }
              }
            }
          }
        `,
        settings: graphql`
          fragment QueueRoute_settings on Settings {
            ...ModerateCardContainer_settings
          }
        `,
        viewer: graphql`
          fragment QueueRoute_viewer on User {
            ...ModerateCardContainer_viewer
          }
        `,
      },
      {
        getConnectionFromProps(props) {
          return props.queue && props.queue.comments;
        },
        getVariables(props, { count, cursor }, fragmentVariables) {
          return {
            ...fragmentVariables,
            count,
            cursor,
          };
        },
        query: paginationQuery,
      }
    )(QueueRoute)
  );

  return enhanced;
};

export const PendingQueueRoute = createQueueRoute(
  GQLMODERATION_QUEUE.PENDING,
  graphql`
    query QueueRoutePendingQuery(
      $storyID: ID
      $siteID: ID
      $section: SectionFilter
      $initialOrderBy: COMMENT_SORT
    ) {
      moderationQueues(storyID: $storyID, siteID: $siteID, section: $section) {
        pending {
          ...QueueRoute_queue @arguments(orderBy: $initialOrderBy)
        }
      }
      settings {
        ...QueueRoute_settings
      }
      viewer {
        ...QueueRoute_viewer
      }
    }
  `,
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query QueueRoutePaginationPendingQuery(
      $storyID: ID
      $siteID: ID
      $section: SectionFilter
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT
    ) {
      moderationQueues(storyID: $storyID, siteID: $siteID, section: $section) {
        pending {
          ...QueueRoute_queue
            @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
        }
      }
    }
  `,
  // eslint-disable-next-line:jsx-wrap-multiline
  <Localized id="moderate-emptyQueue-pending">
    <EmptyMessage>
      Nicely done! There are no more pending comments to moderate.
    </EmptyMessage>
  </Localized>
);

export const ReportedQueueRoute = createQueueRoute(
  GQLMODERATION_QUEUE.REPORTED,
  graphql`
    query QueueRouteReportedQuery(
      $storyID: ID
      $siteID: ID
      $section: SectionFilter
      $initialOrderBy: COMMENT_SORT
    ) {
      moderationQueues(storyID: $storyID, siteID: $siteID, section: $section) {
        reported {
          ...QueueRoute_queue @arguments(orderBy: $initialOrderBy)
        }
      }
      settings {
        ...QueueRoute_settings
      }
      viewer {
        ...QueueRoute_viewer
      }
    }
  `,
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query QueueRoutePaginationReportedQuery(
      $storyID: ID
      $siteID: ID
      $section: SectionFilter
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT
    ) {
      moderationQueues(storyID: $storyID, siteID: $siteID, section: $section) {
        reported {
          ...QueueRoute_queue
            @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
        }
      }
    }
  `,
  // eslint-disable-next-line:jsx-wrap-multiline
  <Localized id="moderate-emptyQueue-reported">
    <EmptyMessage>
      Nicely done! There are no more reported comments to moderate.
    </EmptyMessage>
  </Localized>
);

export const UnmoderatedQueueRoute = createQueueRoute(
  GQLMODERATION_QUEUE.UNMODERATED,
  graphql`
    query QueueRouteUnmoderatedQuery(
      $storyID: ID
      $siteID: ID
      $section: SectionFilter
      $initialOrderBy: COMMENT_SORT
    ) {
      moderationQueues(storyID: $storyID, siteID: $siteID, section: $section) {
        unmoderated {
          ...QueueRoute_queue @arguments(orderBy: $initialOrderBy)
        }
      }
      settings {
        ...QueueRoute_settings
      }
      viewer {
        ...QueueRoute_viewer
      }
    }
  `,
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query QueueRoutePaginationUnmoderatedQuery(
      $storyID: ID
      $siteID: ID
      $section: SectionFilter
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT
    ) {
      moderationQueues(storyID: $storyID, siteID: $siteID, section: $section) {
        unmoderated {
          ...QueueRoute_queue
            @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
        }
      }
    }
  `,
  // eslint-disable-next-line:jsx-wrap-multiline
  <Localized id="moderate-emptyQueue-unmoderated">
    <EmptyMessage>Nicely done! All comments have been moderated.</EmptyMessage>
  </Localized>
);
