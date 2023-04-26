import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, MouseEvent, useCallback } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useViewerEvent } from "coral-framework/lib/events";
import { useMutation } from "coral-framework/lib/relay";
import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import { GQLSTORY_MODE, GQLUSER_STATUS } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import HTMLContent from "coral-stream/common/HTMLContent";
import Timestamp from "coral-stream/common/Timestamp";
import { ViewConversationEvent } from "coral-stream/events";
import { SetCommentIDMutation } from "coral-stream/mutations";
import {
  Box,
  Flex,
  Hidden,
  HorizontalGutter,
  Icon,
  RelativeTime,
} from "coral-ui/components/v2";
import { Button, StarRating } from "coral-ui/components/v3";

import { FeaturedCommentContainer_comment as CommentData } from "coral-stream/__generated__/FeaturedCommentContainer_comment.graphql";
import { FeaturedCommentContainer_settings as SettingsData } from "coral-stream/__generated__/FeaturedCommentContainer_settings.graphql";
import { FeaturedCommentContainer_story as StoryData } from "coral-stream/__generated__/FeaturedCommentContainer_story.graphql";
import { FeaturedCommentContainer_viewer as ViewerData } from "coral-stream/__generated__/FeaturedCommentContainer_viewer.graphql";

import { UserTagsContainer } from "../../Comment";
import MediaSectionContainer from "../../Comment/MediaSection";
import ReactionButtonContainer from "../../Comment/ReactionButton";
import { UsernameWithPopoverContainer } from "../../Comment/Username";
import IgnoredTombstoneOrHideContainer from "../../IgnoredTombstoneOrHideContainer";

import styles from "./FeaturedCommentContainer.css";

interface Props {
  viewer: ViewerData | null;
  comment: CommentData;
  story: StoryData;
  settings: SettingsData;
}

const FeaturedCommentContainer: FunctionComponent<Props> = (props) => {
  const { comment, settings, story, viewer } = props;
  const setCommentID = useMutation(SetCommentIDMutation);
  const isViewerBanned = !!viewer?.status.current.includes(
    GQLUSER_STATUS.BANNED
  );
  const isViewerSuspended = !!viewer?.status.current.includes(
    GQLUSER_STATUS.SUSPENDED
  );
  const isViewerWarned = !!viewer?.status.current.includes(
    GQLUSER_STATUS.WARNED
  );
  const isRatingsAndReviews =
    story.settings.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS;

  const emitViewConversationEvent = useViewerEvent(ViewConversationEvent);
  const onGotoConversation = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      emitViewConversationEvent({
        from: "FEATURED_COMMENTS",
        commentID: comment.id,
      });
      void setCommentID({ id: comment.id });
      return false;
    },
    [emitViewConversationEvent, comment.id, setCommentID]
  );

  const gotoConvAriaLabelId = comment.author?.username
    ? "comments-featured-gotoConversation-label-with-username"
    : "comments-featured-gotoConversation-label-without-username";

  return (
    <IgnoredTombstoneOrHideContainer viewer={props.viewer} comment={comment}>
      <article
        className={cn(CLASSES.featuredComment.$root, styles.root)}
        data-testid={`featuredComment-${comment.id}`}
        aria-labelledby={`featuredComment-${comment.id}-label`}
      >
        <Localized
          id="comments-featured-label"
          elems={{ RelativeTime: <RelativeTime date={comment.createdAt} /> }}
          vars={{ username: comment.author?.username || "" }}
        >
          <Hidden id={`featuredComment-${comment.id}-label`}>
            Featured Comment from {comment.author?.username} {` `}
            <RelativeTime date={comment.createdAt} />
          </Hidden>
        </Localized>
        <HorizontalGutter>
          {isRatingsAndReviews && comment.rating && (
            <StarRating rating={comment.rating} />
          )}
          <HTMLContent
            className={cn(styles.body, CLASSES.featuredComment.content)}
          >
            {comment.body || ""}
          </HTMLContent>
          <MediaSectionContainer
            comment={comment}
            settings={settings}
            defaultExpanded={viewer?.mediaSettings?.unfurlEmbeds}
          />
        </HorizontalGutter>
        <Flex
          direction="row"
          alignItems="center"
          mt={3}
          className={CLASSES.featuredComment.authorBar.$root}
        >
          {comment.author && (
            <UsernameWithPopoverContainer
              className={CLASSES.featuredComment.authorBar.username}
              usernameClassName={styles.username}
              comment={comment}
              viewer={viewer}
              settings={settings}
            />
          )}
          <Box ml={1} container="span">
            <UserTagsContainer
              className={CLASSES.featuredComment.authorBar.userTag}
              story={story}
              comment={comment}
              settings={settings}
            />
          </Box>
          <Box ml={2}>
            <Timestamp className={CLASSES.featuredComment.authorBar.timestamp}>
              {comment.createdAt}
            </Timestamp>
          </Box>
        </Flex>
        <Flex
          justifyContent="space-between"
          mt={2}
          className={CLASSES.featuredComment.actionBar.$root}
        >
          <ReactionButtonContainer
            comment={comment}
            settings={settings}
            viewer={viewer}
            readOnly={
              isViewerBanned ||
              isViewerSuspended ||
              isViewerWarned ||
              story.isArchived ||
              story.isArchiving
            }
            className={CLASSES.featuredComment.actionBar.reactButton}
            reactedClassName={CLASSES.featuredComment.actionBar.reactedButton}
          />
          <Flex alignItems="center">
            {comment.replyCount > 0 && (
              <Flex
                alignItems="center"
                className={cn(
                  styles.replies,
                  CLASSES.featuredComment.actionBar.replies
                )}
              >
                <Icon size="sm">comment</Icon>
                <Localized id="comments-featured-replies">
                  <Box mx={1}>Replies</Box>
                </Localized>
                <Box>{comment.replyCount}</Box>
              </Flex>
            )}
            <Flex alignItems="center">
              <Localized
                id={gotoConvAriaLabelId}
                attrs={{ "aria-label": true }}
                vars={{ username: comment.author?.username }}
              >
                <Button
                  className={cn(
                    CLASSES.featuredComment.actionBar.goToConversation,
                    styles.gotoConversation
                  )}
                  variant="flat"
                  fontSize="small"
                  color="none"
                  paddingSize="none"
                  onClick={onGotoConversation}
                  href={getURLWithCommentID(story.url, comment.id)}
                >
                  <Icon size="sm" className={styles.icon}>
                    forum
                  </Icon>
                  <Localized id="comments-featured-gotoConversation">
                    <span>Go to conversation</span>
                  </Localized>
                </Button>
              </Localized>
            </Flex>
          </Flex>
        </Flex>
      </article>
    </IgnoredTombstoneOrHideContainer>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment FeaturedCommentContainer_viewer on User {
      id
      status {
        current
      }
      ignoredUsers {
        id
      }
      mediaSettings {
        unfurlEmbeds
      }
      role
      ...UsernameWithPopoverContainer_viewer
      ...ReactionButtonContainer_viewer
      ...IgnoredTombstoneOrHideContainer_viewer
    }
  `,
  story: graphql`
    fragment FeaturedCommentContainer_story on Story {
      url
      commentCounts {
        tags {
          FEATURED
        }
      }
      settings {
        mode
      }
      isArchiving
      isArchived
      ...UserTagsContainer_story
    }
  `,
  comment: graphql`
    fragment FeaturedCommentContainer_comment on Comment {
      id
      author {
        id
        username
      }
      parent {
        author {
          username
        }
      }
      rating
      body
      createdAt
      lastViewerAction
      replyCount
      ...UsernameWithPopoverContainer_comment
      ...ReactionButtonContainer_comment
      ...MediaSectionContainer_comment
      ...UserTagsContainer_comment
      ...IgnoredTombstoneOrHideContainer_comment
    }
  `,
  settings: graphql`
    fragment FeaturedCommentContainer_settings on Settings {
      ...ReactionButtonContainer_settings
      ...UserTagsContainer_settings
      ...MediaSectionContainer_settings
      ...UsernameWithPopoverContainer_settings
    }
  `,
})(FeaturedCommentContainer);

export default enhanced;
