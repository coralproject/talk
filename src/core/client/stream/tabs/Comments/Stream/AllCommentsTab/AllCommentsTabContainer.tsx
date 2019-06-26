import React, { FunctionComponent, useCallback, useEffect } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import FadeInTransition from "coral-framework/components/FadeInTransition";
import {
  useLoadMore,
  useLocal,
  useMutation,
  useSubscription,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";
import { Omit, PropTypesOf } from "coral-framework/types";
import { AllCommentsTabContainer_settings } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";
import { AllCommentsTabContainer_story } from "coral-stream/__generated__/AllCommentsTabContainer_story.graphql";
import { AllCommentsTabContainer_viewer } from "coral-stream/__generated__/AllCommentsTabContainer_viewer.graphql";
import { AllCommentsTabContainerLocal } from "coral-stream/__generated__/AllCommentsTabContainerLocal.graphql";
import { AllCommentsTabContainerPaginationQueryVariables } from "coral-stream/__generated__/AllCommentsTabContainerPaginationQuery.graphql";
import { Box, Button, HorizontalGutter } from "coral-ui/components";
import { Localized } from "fluent-react/compat";

import { CommentContainer } from "../../Comment";
import IgnoredTombstoneOrHideContainer from "../../IgnoredTombstoneOrHideContainer";
import { ReplyListContainer } from "../../ReplyList";
import AllCommentsTabViewNewMutation from "./AllCommentsTabViewNewMutation";
import CommentCreatedSubscription from "./CommentCreatedSubscription";

interface Props {
  story: AllCommentsTabContainer_story;
  settings: AllCommentsTabContainer_settings;
  viewer: AllCommentsTabContainer_viewer | null;
  relay: RelayPaginationProp;
}

// tslint:disable-next-line:no-unused-expression
graphql`
  fragment AllCommentsTabContainer_comment on Comment {
    id
    ...CommentContainer_comment
    ...ReplyListContainer1_comment
    ...IgnoredTombstoneOrHideContainer_comment
  }
`;

export const AllCommentsTabContainer: FunctionComponent<Props> = props => {
  const [{ commentsOrderBy }] = useLocal<AllCommentsTabContainerLocal>(
    graphql`
      fragment AllCommentsTabContainerLocal on Local {
        commentsOrderBy
      }
    `
  );
  const subscribeToCommentCreated = useSubscription(CommentCreatedSubscription);
  useEffect(() => {
    // TODO: (cvle) check for story or settings state
    // for whether or not we should turn on subscriptions:
    // e.g. `if (!props.story.settings.live) { return; }`
    if (props.story.isClosed || props.settings.disableCommenting.enabled) {
      return;
    }
    if (
      commentsOrderBy === GQLCOMMENT_SORT.CREATED_AT_ASC &&
      props.relay.hasMore()
    ) {
      // If sort by oldest we only need to know if there is more to load.
      return;
    }
    if (
      ![
        GQLCOMMENT_SORT.CREATED_AT_ASC,
        GQLCOMMENT_SORT.CREATED_AT_DESC,
      ].includes(commentsOrderBy as GQLCOMMENT_SORT)
    ) {
      // Only chronological sort supports top level live updates of incoming comments.
      return;
    }
    const disposable = subscribeToCommentCreated({
      storyID: props.story.id,
      orderBy: commentsOrderBy,
    });
    return () => {
      disposable.dispose();
    };
  }, [
    commentsOrderBy,
    subscribeToCommentCreated,
    props.story.id,
    props.relay.hasMore(),
  ]);
  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 10);
  const viewMore = useMutation(AllCommentsTabViewNewMutation);
  const onViewMore = useCallback(() => viewMore({ storyID: props.story.id }), [
    props.story.id,
    viewMore,
  ]);
  const comments = props.story.comments.edges.map(edge => edge.node);
  const viewNewCount =
    (props.story.comments.viewNewEdges &&
      props.story.comments.viewNewEdges.length) ||
    0;
  return (
    <>
      {Boolean(viewNewCount && viewNewCount > 0) && (
        <Box mb={4} clone>
          <Button
            variant="outlined"
            color="primary"
            onClick={onViewMore}
            fullWidth
          >
            <Localized id="comments-viewNew" $count={viewNewCount}>
              <span>View {viewNewCount} New Comments</span>
            </Localized>
          </Button>
        </Box>
      )}
      <HorizontalGutter
        id="comments-allComments-log"
        data-testid="comments-allComments-log"
        role="log"
        aria-live="polite"
      >
        {comments.map(comment => (
          <IgnoredTombstoneOrHideContainer
            key={comment.id}
            viewer={props.viewer}
            comment={comment}
          >
            <FadeInTransition active={Boolean(comment.enteredLive)}>
              <HorizontalGutter>
                <CommentContainer
                  viewer={props.viewer}
                  settings={props.settings}
                  comment={comment}
                  story={props.story}
                />
                <ReplyListContainer
                  settings={props.settings}
                  viewer={props.viewer}
                  comment={comment}
                  story={props.story}
                />
              </HorizontalGutter>
            </FadeInTransition>
          </IgnoredTombstoneOrHideContainer>
        ))}
        {props.relay.hasMore() && (
          <Localized id="comments-loadMore">
            <Button
              onClick={loadMore}
              variant="outlined"
              fullWidth
              disabled={isLoadingMore}
              aria-controls="comments-allComments-log"
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
  AllCommentsTabContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  AllCommentsTabContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    story: graphql`
      fragment AllCommentsTabContainer_story on Story
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_DESC }
        ) {
        id
        isClosed
        comments(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "Stream_comments") {
          viewNewEdges {
            cursor
          }
          edges {
            node {
              enteredLive
              ...AllCommentsTabContainer_comment @relay(mask: false)
            }
          }
        }
        ...PostCommentFormContainer_story
        ...CommentContainer_story
        ...ReplyListContainer1_story
        ...CreateCommentReplyMutation_story
        ...CreateCommentMutation_story
      }
    `,
    viewer: graphql`
      fragment AllCommentsTabContainer_viewer on User {
        ...ReplyListContainer1_viewer
        ...CommentContainer_viewer
        ...CreateCommentReplyMutation_viewer
        ...CreateCommentMutation_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
        status {
          current
        }
      }
    `,
    settings: graphql`
      fragment AllCommentsTabContainer_settings on Settings {
        reaction {
          sortLabel
        }
        disableCommenting {
          enabled
        }
        ...ReplyListContainer1_settings
        ...CommentContainer_settings
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.story && props.story.comments;
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
      query AllCommentsTabContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $orderBy: COMMENT_SORT!
        $storyID: ID
      ) {
        story(id: $storyID) {
          ...AllCommentsTabContainer_story
            @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
        }
      }
    `,
  }
)(AllCommentsTabContainer);

export type AllCommentsTabContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
