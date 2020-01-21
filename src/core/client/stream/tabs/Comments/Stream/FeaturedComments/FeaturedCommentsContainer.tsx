import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { useViewerNetworkEvent } from "coral-framework/lib/events";
import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { Omit, PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { LoadMoreFeaturedCommentsEvent } from "coral-stream/events";
import { Button, HorizontalGutter } from "coral-ui/components";

import { FeaturedCommentsContainer_settings as SettingsData } from "coral-stream/__generated__/FeaturedCommentsContainer_settings.graphql";
import { FeaturedCommentsContainer_story as StoryData } from "coral-stream/__generated__/FeaturedCommentsContainer_story.graphql";
import { FeaturedCommentsContainer_viewer as ViewerData } from "coral-stream/__generated__/FeaturedCommentsContainer_viewer.graphql";
import { FeaturedCommentsContainerPaginationQueryVariables } from "coral-stream/__generated__/FeaturedCommentsContainerPaginationQuery.graphql";

import IgnoredTombstoneOrHideContainer from "../../IgnoredTombstoneOrHideContainer";
import FeaturedCommentContainer from "./FeaturedCommentContainer";

interface Props {
  story: StoryData;
  settings: SettingsData;
  viewer: ViewerData | null;
  relay: RelayPaginationProp;
}

export const FeaturedCommentsContainer: FunctionComponent<Props> = props => {
  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 10);
  const beginLoadMoreEvent = useViewerNetworkEvent(
    LoadMoreFeaturedCommentsEvent
  );
  const loadMoreAndEmit = useCallback(async () => {
    const loadMoreEvent = beginLoadMoreEvent({ storyID: props.story.id });
    try {
      await loadMore();
      loadMoreEvent.success();
    } catch (error) {
      loadMoreEvent.error({ message: error.message, code: error.code });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [loadMore, beginLoadMoreEvent, props.story.id]);
  const comments = props.story.featuredComments.edges.map(edge => edge.node);
  return (
    <>
      <HorizontalGutter
        id="comments-featuredComments-log"
        data-testid="comments-featuredComments-log"
        role="log"
        aria-live="polite"
        spacing={3}
      >
        {comments.map(comment => (
          <IgnoredTombstoneOrHideContainer
            key={comment.id}
            viewer={props.viewer}
            comment={comment}
          >
            <FeaturedCommentContainer
              viewer={props.viewer}
              settings={props.settings}
              comment={comment}
              story={props.story}
            />
          </IgnoredTombstoneOrHideContainer>
        ))}
        {props.relay.hasMore() && (
          <Localized id="comments-loadMore">
            <Button
              onClick={loadMoreAndEmit}
              variant="outlined"
              fullWidth
              disabled={isLoadingMore}
              aria-controls="comments-featuredComments-log"
              className={CLASSES.featuredCommentsTabPane.loadMoreButton}
            >
              Load More
            </Button>
          </Localized>
        )}
      </HorizontalGutter>
    </>
  );
};

// TODO: (cvle) if this could be autogenerated..
type FragmentVariables = Omit<
  FeaturedCommentsContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  FeaturedCommentsContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    story: graphql`
      fragment FeaturedCommentsContainer_story on Story
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_DESC }
        ) {
        id
        featuredComments(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "Stream_featuredComments") {
          edges {
            node {
              id
              ...FeaturedCommentContainer_comment
              ...IgnoredTombstoneOrHideContainer_comment
            }
          }
        }
        ...PostCommentFormContainer_story
        ...FeaturedCommentContainer_story
      }
    `,
    viewer: graphql`
      fragment FeaturedCommentsContainer_viewer on User {
        ...FeaturedCommentContainer_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
        status {
          current
        }
      }
    `,
    settings: graphql`
      fragment FeaturedCommentsContainer_settings on Settings {
        reaction {
          sortLabel
        }
        ...FeaturedCommentContainer_settings
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.story && props.story.featuredComments;
    },
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        orderBy: fragmentVariables.orderBy,
        // storyID isn't specified as an @argument for the fragment, but it should be a
        // variable available for the fragment under the query root.
        storyID: props.story.id,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query FeaturedCommentsContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $orderBy: COMMENT_SORT!
        $storyID: ID
      ) {
        story(id: $storyID) {
          ...FeaturedCommentsContainer_story
            @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
        }
      }
    `,
  }
)(FeaturedCommentsContainer);

export type FeaturedCommentsContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
