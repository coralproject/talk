import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, MouseEvent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useViewerEvent } from "coral-framework/lib/events";
import { useMutation } from "coral-framework/lib/relay";
import { GQLUSER_STATUS } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import HTMLContent from "coral-stream/common/HTMLContent";
import Timestamp from "coral-stream/common/Timestamp";
import { ViewConversationEvent } from "coral-stream/events";
import { SetCommentIDMutation } from "coral-stream/mutations";
import {
  Flex,
  Hidden,
  Icon,
  RelativeTime,
  TextLink,
} from "coral-ui/components/v2";

import { AnsweredCommentContainer_comment$key as CommentData } from "coral-stream/__generated__/AnsweredCommentContainer_comment.graphql";
import { AnsweredCommentContainer_settings$key as SettingsData } from "coral-stream/__generated__/AnsweredCommentContainer_settings.graphql";
import { AnsweredCommentContainer_story$key as StoryData } from "coral-stream/__generated__/AnsweredCommentContainer_story.graphql";
import { AnsweredCommentContainer_viewer$key as ViewerData } from "coral-stream/__generated__/AnsweredCommentContainer_viewer.graphql";

import { CommentContainer, UserTagsContainer } from "../../Comment";
import MediaSectionContainer from "../../Comment/MediaSection/MediaSectionContainer";
import ReactionButtonContainer from "../../Comment/ReactionButton";
import { UsernameWithPopoverContainer } from "../../Comment/Username";
import IgnoredTombstoneOrHideContainer from "../../IgnoredTombstoneOrHideContainer";

import styles from "./AnsweredCommentContainer.css";

interface Props {
  viewer: ViewerData | null;
  comment: CommentData;
  story: StoryData;
  settings: SettingsData;
}

const AnsweredCommentContainer: FunctionComponent<Props> = ({
  viewer,
  comment,
  story,
  settings,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment AnsweredCommentContainer_viewer on User {
        id
        status {
          current
        }
        ignoredUsers {
          id
        }
        role
        mediaSettings {
          unfurlEmbeds
        }
        ...UsernameWithPopoverContainer_viewer
        ...ReactionButtonContainer_viewer
        ...CommentContainer_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
      }
    `,
    viewer
  );
  const storyData = useFragment(
    graphql`
      fragment AnsweredCommentContainer_story on Story {
        url
        isArchiving
        isArchived
        ...UserTagsContainer_story
        ...CommentContainer_story
      }
    `,
    story
  );
  const commentData = useFragment(
    graphql`
      fragment AnsweredCommentContainer_comment on Comment {
        id
        author {
          id
          username
        }
        parent {
          author {
            username
          }
          ...CommentContainer_comment
        }
        body
        createdAt
        lastViewerAction
        replyCount
        ...MediaSectionContainer_comment
        ...UsernameWithPopoverContainer_comment
        ...ReactionButtonContainer_comment
        ...UserTagsContainer_comment
        ...IgnoredTombstoneOrHideContainer_comment
      }
    `,
    comment
  );
  const settingsData = useFragment(
    graphql`
      fragment AnsweredCommentContainer_settings on Settings {
        ...ReactionButtonContainer_settings
        ...UserTagsContainer_settings
        ...CommentContainer_settings
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
      {commentData.parent && (
        <CommentContainer
          viewer={viewerData}
          settings={settingsData}
          comment={commentData.parent}
          story={storyData}
          hideAnsweredTag
          hideReportButton
          hideModerationCarat
          disableReplies
          highlight
        />
      )}
      <article
        className={cn(CLASSES.featuredComment.$root, styles.root)}
        data-testid={`commentAnswer-${commentData.id}`}
        aria-labelledby={`commentAnswerLabel-${commentData.id}`}
        id={`commentAnswer-${commentData.id}`}
      >
        <Localized
          id="qa-answered-answerLabel"
          RelativeTime={<RelativeTime date={commentData.createdAt} />}
          $username={commentData.author?.username || ""}
        >
          <Hidden id={`commentAnswerLabel-${commentData.id}`}>
            Answer from {commentData.author?.username} {` `}
            <RelativeTime date={commentData.createdAt} />
          </Hidden>
        </Localized>
        <Flex
          direction="row"
          alignItems="center"
          mt={4}
          className={CLASSES.featuredComment.authorBar.$root}
        >
          {commentData.author && (
            <UsernameWithPopoverContainer
              className={cn(
                CLASSES.featuredComment.authorBar.username,
                styles.username
              )}
              comment={commentData}
              viewer={viewerData}
              settings={settingsData}
            />
          )}
          <Flex alignItems="flex-start" justifyContent="center">
            <UserTagsContainer
              className={CLASSES.featuredComment.authorBar.userTag}
              story={storyData}
              comment={commentData}
              settings={settingsData}
            />
            <Timestamp
              className={cn(
                CLASSES.featuredComment.authorBar.timestamp,
                styles.timestamp
              )}
            >
              {commentData.createdAt}
            </Timestamp>
          </Flex>
        </Flex>
        <HTMLContent className={CLASSES.featuredComment.content}>
          {commentData.body || ""}
        </HTMLContent>
        <MediaSectionContainer
          comment={commentData}
          settings={settingsData}
          defaultExpanded={viewerData?.mediaSettings?.unfurlEmbeds}
        />
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
            isQA
          />
          <Flex alignItems="center">
            {commentData.replyCount > 0 && (
              <Flex alignItems="center" className={styles.replies}>
                <Flex
                  alignItems="center"
                  className={CLASSES.featuredComment.actionBar.replies}
                >
                  <Icon size="md">reply</Icon>
                  <Localized id="qa-answered-replies">
                    <span className={styles.repliesText}>Replies</span>
                  </Localized>
                  <span>{commentData.replyCount}</span>
                </Flex>
                <span className={styles.repliesDivider}>|</span>
              </Flex>
            )}
            <div>
              <TextLink
                className={cn(
                  CLASSES.featuredComment.actionBar.goToConversation,
                  styles.gotoConversation
                )}
                onClick={onGotoConversation}
                href={getURLWithCommentID(storyData.url, commentData.id)}
              >
                <Localized id="qa-answered-gotoConversation">
                  <span>Go to Conversation</span>
                </Localized>
                <span className={styles.gotoArrow}>&gt;</span>
              </TextLink>
            </div>
          </Flex>
        </Flex>
      </article>
    </IgnoredTombstoneOrHideContainer>
  );
};

export default AnsweredCommentContainer;
