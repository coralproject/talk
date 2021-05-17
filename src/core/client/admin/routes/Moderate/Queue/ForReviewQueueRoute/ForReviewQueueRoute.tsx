import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import { CommentContent } from "coral-admin/components/Comment";
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
  CheckBox,
  Flex,
  HorizontalGutter,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Timestamp,
} from "coral-ui/components/v2";
import { ComponentLink } from "coral-ui/components/v3";

import { ForReviewQueueRoute_query } from "coral-admin/__generated__/ForReviewQueueRoute_query.graphql";
import { ForReviewQueueRouteLocal } from "coral-admin/__generated__/ForReviewQueueRouteLocal.graphql";
import {
  ForReviewQueueRoutePaginationQueryVariables,
  SectionFilter,
} from "coral-admin/__generated__/ForReviewQueueRoutePaginationQuery.graphql";

import LoadingQueue from "../LoadingQueue";
import { MarkFlagReviewedMutation } from "./MarkFlagReviewedMutation";
import { getLocationOrigin } from "coral-framework/utils";

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

  const flagActions = query.flagged.edges.map(
    (edge: { node: any }) => edge.node
  );

  return (
    <IntersectionProvider>
      <HorizontalGutter size="double">
        <Table fullWidth>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Reported By</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Reviewed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flagActions.map((a, i) => (
              <>
                <TableRow key={i}>
                  <TableCell>
                    <Timestamp>{a.createdAt}</Timestamp>
                  </TableCell>
                  <TableCell>
                    {
                      <ComponentLink
                        href={`${getLocationOrigin()}/admin/moderate/comment/${
                          a.comment.id
                        }`}
                      >
                        <CommentContent>
                          {
                            a.comment.revisionHistory.find(
                              (r: { id: string }) =>
                                r.id === a.commentRevisionID
                            ).body
                          }
                        </CommentContent>
                      </ComponentLink>
                    }
                  </TableCell>
                  <TableCell>{a.flagger.username}</TableCell>
                  <TableCell>{a.reason}</TableCell>
                  <TableCell>{a.additionalDetails}</TableCell>
                  <TableCell>
                    <CheckBox
                      checked={a.reviewed}
                      onChange={(event) => {
                        const enabled = !!(event.currentTarget.value === "on");
                        void onReview(a.id, enabled);
                      }}
                    >
                      {""}
                    </CheckBox>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
        {relay.isLoading() && (
          <Flex justifyContent="center">
            <Spinner />
          </Flex>
        )}
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
        flagged(first: $count, after: $cursor)
          @connection(key: "ForReviewQueue_flagged") {
          edges {
            node {
              id
              createdAt
              flagger {
                id
                username
              }
              reason
              additionalDetails
              reviewed
              comment {
                id
                revisionHistory {
                  id
                  body
                }
              }
              commentRevisionID
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
      return props.query && props.query.flagged;
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
