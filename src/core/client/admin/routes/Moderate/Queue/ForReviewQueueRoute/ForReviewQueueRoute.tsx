import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import parseModerationOptions from "coral-framework/helpers/parseModerationOptions";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  LOCAL_ID,
  lookup,
  useLocal,
  useMutation,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { createRouteConfig } from "coral-framework/lib/router";
import {
  Flex,
  HorizontalGutter,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import { ForReviewQueueRoute_query } from "coral-admin/__generated__/ForReviewQueueRoute_query.graphql";
import { ForReviewQueueRouteLocal } from "coral-admin/__generated__/ForReviewQueueRouteLocal.graphql";
import {
  ForReviewQueueRoutePaginationQueryVariables,
  SectionFilter,
} from "coral-admin/__generated__/ForReviewQueueRoutePaginationQuery.graphql";

import LoadingQueue from "../LoadingQueue";
import ForReviewQueueRow from "./ForReviewQueueRow";
import { MarkFlagReviewedMutation } from "./MarkFlagReviewedMutation";

import styles from "./ForReviewQueueRoute.css";

interface Props {
  query: ForReviewQueueRoute_query;
  relay: RelayPaginationProp;
  storyID?: string | null;
  siteID?: string | null;
  section?: SectionFilter | null;
}

export const ForReviewQueueRoute: FunctionComponent<Props> = ({
  relay,
  query,
}) => {
  const [disableLoadMore, setDisableLoadMore] = useState(false);

  const markFlagged = useMutation(MarkFlagReviewedMutation);

  const [{ moderationQueueSort }] = useLocal<ForReviewQueueRouteLocal>(graphql`
    fragment ForReviewQueueRouteLocal on Local {
      moderationQueueSort
    }
  `);

  const [, isRefetching] = useRefetch<
    ForReviewQueueRoutePaginationQueryVariables
  >(relay, 5, {
    orderBy: moderationQueueSort,
  });

  const loadMore = useCallback(() => {
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    setDisableLoadMore(true);

    relay.loadMore(
      10, // Fetch the next 10 feed items
      (error: any) => {
        setDisableLoadMore(false);

        if (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    );
  }, [relay]);

  const onReview = useCallback(
    async (id: string, reviewed: boolean) => {
      await markFlagged({ id, reviewed });
    },
    [markFlagged]
  );

  if (!query || !query.viewer) {
    return null;
  }

  if (isRefetching) {
    return <LoadingQueue />;
  }

  const flagActions = query.flags.edges.map((edge: { node: any }) => edge.node);

  return (
    <IntersectionProvider>
      <HorizontalGutter size="double">
        <Table fullWidth className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Localized id="forReview-time">Time</Localized>
              </TableCell>
              <TableCell>
                <Localized id="forReview-comment">Comment</Localized>
              </TableCell>
              <TableCell>
                <Localized id="forReview-reportedBy">Reported by</Localized>
              </TableCell>
              <TableCell>
                <Localized id="forReview-reason">Reason</Localized>
              </TableCell>
              <TableCell>
                <Localized id="forReview-description">Description</Localized>
              </TableCell>
              <TableCell>
                <Localized id="forReview-reviewed">Reviewed</Localized>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flagActions.map((flag) => (
              <ForReviewQueueRow
                key={flag.id}
                onReview={onReview}
                flag={flag}
              />
            ))}
          </TableBody>
        </Table>
        {relay.hasMore() && (
          <Flex justifyContent="center">
            <AutoLoadMore
              disableLoadMore={disableLoadMore}
              onLoadMore={loadMore}
            />
          </Flex>
        )}
      </HorizontalGutter>
    </IntersectionProvider>
  );
};

type FragmentVariables = ForReviewQueueRoutePaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  ForReviewQueueRoutePaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment ForReviewQueueRoute_query on Query
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 5 }
          cursor: { type: "Cursor" }
          storyID: { type: "ID" }
          siteID: { type: "ID" }
          section: { type: "SectionFilter" }
          orderBy: { type: "COMMENT_SORT", defaultValue: CREATED_AT_DESC }
        ) {
        flags(
          first: $count
          after: $cursor
          orderBy: $orderBy
          storyID: $storyID
        ) @connection(key: "ForReviewQueue_flags") {
          edges {
            node {
              id
              ...ForReviewQueueRow_flag
            }
          }
        }
        viewer {
          id
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.query && props.query.flags;
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query ForReviewQueueRoutePaginationQuery(
        $storyID: ID
        $siteID: ID
        $section: SectionFilter
        $cursor: Cursor
        $count: Int!
        $orderBy: COMMENT_SORT
      ) {
        ...ForReviewQueueRoute_query
          @arguments(
            storyID: $storyID
            siteID: $siteID
            section: $section
            count: $count
            cursor: $cursor
            orderBy: $orderBy
          )
      }
    `,
  }
)(ForReviewQueueRoute);

export const routeConfig = createRouteConfig<Props, ForReviewQueueRoute_query>({
  Component: enhanced,
  query: graphql`
    query ForReviewQueueRouteQuery(
      $storyID: ID
      $siteID: ID
      $section: SectionFilter
      $initialOrderBy: COMMENT_SORT
    ) {
      ...ForReviewQueueRoute_query
        @arguments(
          storyID: $storyID
          siteID: $siteID
          section: $section
          orderBy: $initialOrderBy
        )
    }
  `,
  prepareVariables: (params, match) => {
    const initialOrderBy = lookup(match.context.relayEnvironment, LOCAL_ID)!
      .moderationQueueSort;
    return {
      ...params,
      initialOrderBy,
    };
  },
  cacheConfig: { force: true },
  // eslint-disable-next-line react/display-name
  render: ({ Component, data, match }) => {
    if (Component && data) {
      const { storyID, siteID, section } = parseModerationOptions(match);
      return (
        <Component
          query={data}
          storyID={storyID}
          siteID={siteID}
          section={section}
        />
      );
    }
    return <LoadingQueue />;
  },
});

export default enhanced;
