import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useViewerEvent,
  useViewerNetworkEvent,
} from "coral-framework/lib/events";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  useLoadMore,
  useLocal,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import {
  GQLCOMMENT_SORT,
  GQLFEATURE_FLAG,
  GQLUSER_STATUS,
} from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import {
  LoadMoreFeaturedCommentsEvent,
  SetCommentsTabEvent,
} from "coral-stream/events";
import { HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { FeaturedCommentsContainer_settings as SettingsData } from "coral-stream/__generated__/FeaturedCommentsContainer_settings.graphql";
import { FeaturedCommentsContainer_story as StoryData } from "coral-stream/__generated__/FeaturedCommentsContainer_story.graphql";
import { FeaturedCommentsContainer_viewer as ViewerData } from "coral-stream/__generated__/FeaturedCommentsContainer_viewer.graphql";
import { FeaturedCommentsContainerLocal } from "coral-stream/__generated__/FeaturedCommentsContainerLocal.graphql";
import { FeaturedCommentsContainerPaginationQueryVariables } from "coral-stream/__generated__/FeaturedCommentsContainerPaginationQuery.graphql";
import { COMMENTS_TAB } from "coral-stream/__generated__/StreamQueryLocal.graphql";

import CommentsLinks from "../CommentsLinks";
import { PostCommentFormContainer } from "../PostCommentForm";
import ViewersWatchingContainer from "../ViewersWatchingContainer";
import FeaturedCommentContainer from "./FeaturedCommentContainer";

import styles from "./FeaturedCommentsContainer.css";

interface Props {
  story: StoryData;
  settings: SettingsData;
  viewer: ViewerData | null;
  relay: RelayPaginationProp;
}

export const FeaturedCommentsContainer: FunctionComponent<Props> = (props) => {
  const emitSetCommentsTabEvent = useViewerEvent(SetCommentsTabEvent);

  const [local, setLocal] = useLocal<FeaturedCommentsContainerLocal>(
    graphql`
      fragment FeaturedCommentsContainerLocal on Local {
        commentsOrderBy
        commentsTab
      }
    `
  );

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

  const onChangeTab = useCallback(
    (tab: COMMENTS_TAB, emit = true) => {
      if (local.commentsTab === tab) {
        return;
      }

      setLocal({ commentsTab: tab });

      if (emit) {
        emitSetCommentsTabEvent({ tab });
      }
    },
    [local.commentsTab, setLocal, emitSetCommentsTabEvent]
  );

  const comments = props.story.featuredComments.edges.map((edge) => edge.node);

  const alternateOldestViewEnabled =
    props.settings.featureFlags.includes(
      GQLFEATURE_FLAG.ALTERNATE_OLDEST_FIRST_VIEW
    ) &&
    local.commentsOrderBy === GQLCOMMENT_SORT.CREATED_AT_ASC &&
    !props.story.isClosed &&
    !props.settings.disableCommenting.enabled;

  const banned = !!props.viewer?.status.current.includes(GQLUSER_STATUS.BANNED);
  const suspended = !!props.viewer?.status.current.includes(
    GQLUSER_STATUS.SUSPENDED
  );
  const warned = !!props.viewer?.status.current.includes(GQLUSER_STATUS.WARNED);

  const showCommentForm =
    // If we do have the alternate view enabled and...
    alternateOldestViewEnabled &&
    // If we aren't banned and...
    !banned &&
    // If we aren't suspended and...
    !suspended &&
    // If we aren't warned.
    !warned;

  const showGoToDiscussions =
    !!props.viewer &&
    !!props.settings &&
    props.settings.featureFlags.includes(GQLFEATURE_FLAG.DISCUSSIONS);

  return (
    <>
      <HorizontalGutter
        id="comments-featuredComments-log"
        data-testid="comments-featuredComments-log"
        spacing={3}
        role="log"
        aria-live="off"
      >
        {comments.map((comment) => (
          <FeaturedCommentContainer
            key={comment.id}
            viewer={props.viewer}
            settings={props.settings}
            comment={comment}
            story={props.story}
          />
        ))}
        {props.relay.hasMore() && (
          <Localized id="comments-loadMore">
            <Button
              key={comments.length}
              onClick={loadMoreAndEmit}
              color="secondary"
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
      {alternateOldestViewEnabled && (
        <HorizontalGutter mt={6} spacing={4}>
          <IntersectionProvider>
            <ViewersWatchingContainer
              story={props.story}
              settings={props.settings}
            />
          </IntersectionProvider>
          {showCommentForm && (
            <PostCommentFormContainer
              story={props.story}
              settings={props.settings}
              viewer={props.viewer}
              commentsOrderBy={local.commentsOrderBy}
              tab="FEATURED_COMMENTS"
              onChangeTab={onChangeTab}
            />
          )}
          <div className={styles.borderedFooter}>
            <CommentsLinks
              showGoToDiscussions={showGoToDiscussions}
              showGoToProfile={!!props.viewer}
            />
          </div>
        </HorizontalGutter>
      )}
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
        count: { type: "Int", defaultValue: 5 }
        cursor: { type: "Cursor" }
        orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_DESC }
      ) {
        id
        isClosed
        featuredComments(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "Stream_featuredComments") {
          edges {
            node {
              id
              ...FeaturedCommentContainer_comment
            }
          }
        }
        ...PostCommentFormContainer_story
        ...FeaturedCommentContainer_story
        ...ViewersWatchingContainer_story
        ...PostCommentFormContainer_story
      }
    `,
    viewer: graphql`
      fragment FeaturedCommentsContainer_viewer on User {
        ...FeaturedCommentContainer_viewer
        ...PostCommentFormContainer_viewer
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
        featureFlags
        disableCommenting {
          enabled
        }
        ...FeaturedCommentContainer_settings
        ...ViewersWatchingContainer_settings
        ...PostCommentFormContainer_settings
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.story && props.story.featuredComments;
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
