import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, MouseEvent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useViewerEvent } from "coral-framework/lib/events";
import { useMutation } from "coral-framework/lib/relay";
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

import { FeaturedCommentContainer_comment$key as CommentData } from "coral-stream/__generated__/FeaturedCommentContainer_comment.graphql";
import { FeaturedCommentContainer_settings$key as SettingsData } from "coral-stream/__generated__/FeaturedCommentContainer_settings.graphql";
import { FeaturedCommentContainer_story$key as StoryData } from "coral-stream/__generated__/FeaturedCommentContainer_story.graphql";
import { FeaturedCommentContainer_viewer$key as ViewerData } from "coral-stream/__generated__/FeaturedCommentContainer_viewer.graphql";

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

const FeaturedCommentContainer: FunctionComponent<Props> = ({
  viewer,
  comment,
  story,
  settings,
}) => {
  const viewerData = useFragment(
    graphql`
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
    viewer
  );
  const storyData = useFragment(
    graphql`
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
    story
  );
  const commentData = useFragment(
    graphql`
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
    comment
  );
  const settingsData = useFragment(
    graphql`
      fragment FeaturedCommentContainer_settings on Settings {
        ...ReactionButtonContainer_settings
        ...UserTagsContainer_settings
        ...MediaSectionContainer_settings
        ...UsernameWithPopoverContainer_settings
      }
    `,
    settings
  );

  const setCommentID = useMutation(SetCommentIDMutation);
  const isViewerBanned = !!viewerData?.status.current.includes(
    GQLUSER_STATUS.BANNED
  );
  const isViewerSuspended = !!viewerData?.status.current.includes(
    GQLUSER_STATUS.SUSPENDED
  );
  const isViewerWarned = !!viewerData?.status.current.includes(
    GQLUSER_STATUS.WARNED
  );
  const isRatingsAndReviews =
    storyData.settings.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS;

  const emitViewConversationEvent = useViewerEvent(ViewConversationEvent);
  const onGotoConversation = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      emitViewConversationEvent({
        from: "FEATURED_COMMENTS",
        commentID: commentData.id,
      });
      void setCommentID({ id: commentData.id });
      return false;
    },
    [emitViewConversationEvent, commentData.id, setCommentID]
  );

  return (
    <IgnoredTombstoneOrHideContainer viewer={viewerData} comment={commentData}>
      <article
        className={cn(CLASSES.featuredComment.$root, styles.root)}
        data-testid={`featuredComment-${commentData.id}`}
        aria-labelledby={`featuredComment-${commentData.id}-label`}
      >
        <Localized
          id="comments-featured-label"
          RelativeTime={<RelativeTime date={commentData.createdAt} />}
          $username={commentData.author?.username || ""}
        >
          <Hidden id={`featuredComment-${commentData.id}-label`}>
            Featured Comment from {commentData.author?.username} {` `}
            <RelativeTime date={commentData.createdAt} />
          </Hidden>
        </Localized>
        <HorizontalGutter>
          {isRatingsAndReviews && commentData.rating && (
            <StarRating rating={commentData.rating} />
          )}
          <HTMLContent
            className={cn(styles.body, CLASSES.featuredComment.content)}
          >
            {commentData.body || ""}
          </HTMLContent>
          <MediaSectionContainer
            comment={commentData}
            settings={settingsData}
            defaultExpanded={viewerData?.mediaSettings?.unfurlEmbeds}
          />
        </HorizontalGutter>
        <Flex
          direction="row"
          alignItems="center"
          mt={3}
          className={CLASSES.featuredComment.authorBar.$root}
        >
          {commentData.author && (
            <UsernameWithPopoverContainer
              className={CLASSES.featuredComment.authorBar.username}
              usernameClassName={styles.username}
              comment={commentData}
              viewer={viewerData}
              settings={settingsData}
            />
          )}
          <Box ml={1} container="span">
            <UserTagsContainer
              className={CLASSES.featuredComment.authorBar.userTag}
              story={storyData}
              comment={commentData}
              settings={settingsData}
            />
          </Box>
          <Box ml={2}>
            <Timestamp className={CLASSES.featuredComment.authorBar.timestamp}>
              {commentData.createdAt}
            </Timestamp>
          </Box>
        </Flex>
        <Flex
          justifyContent="space-between"
          mt={2}
          className={CLASSES.featuredComment.actionBar.$root}
        >
          <ReactionButtonContainer
            comment={commentData}
            settings={settingsData}
            viewer={viewerData}
            readOnly={
              isViewerBanned ||
              isViewerSuspended ||
              isViewerWarned ||
              storyData.isArchived ||
              storyData.isArchiving
            }
            className={CLASSES.featuredComment.actionBar.reactButton}
            reactedClassName={CLASSES.featuredComment.actionBar.reactedButton}
          />
          <Flex alignItems="center">
            {commentData.replyCount > 0 && (
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
                <Box>{commentData.replyCount}</Box>
              </Flex>
            )}
            <Flex alignItems="center">
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
                href={getURLWithCommentID(storyData.url, commentData.id)}
              >
                <Icon size="sm" className={styles.icon}>
                  forum
                </Icon>
                <Localized id="comments-featured-gotoConversation">
                  <span>Go to conversation</span>
                </Localized>
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </article>
    </IgnoredTombstoneOrHideContainer>
  );
};

export default FeaturedCommentContainer;
