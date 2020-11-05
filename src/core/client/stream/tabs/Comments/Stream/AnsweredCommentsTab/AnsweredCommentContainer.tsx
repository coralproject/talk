import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, MouseEvent, useCallback } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useViewerEvent } from "coral-framework/lib/events";
import withFragmentContainer from "coral-framework/lib/relay/withFragmentContainer";
import { GQLUSER_STATUS } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import HTMLContent from "coral-stream/common/HTMLContent";
import Timestamp from "coral-stream/common/Timestamp";
import { ViewConversationEvent } from "coral-stream/events";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "coral-stream/mutations";
import { Flex, Icon, TextLink } from "coral-ui/components/v2";

import { AnsweredCommentContainer_comment as CommentData } from "coral-stream/__generated__/AnsweredCommentContainer_comment.graphql";
import { AnsweredCommentContainer_settings as SettingsData } from "coral-stream/__generated__/AnsweredCommentContainer_settings.graphql";
import { AnsweredCommentContainer_story as StoryData } from "coral-stream/__generated__/AnsweredCommentContainer_story.graphql";
import { AnsweredCommentContainer_viewer as ViewerData } from "coral-stream/__generated__/AnsweredCommentContainer_viewer.graphql";

import { CommentContainer, UserTagsContainer } from "../../Comment";
import MediaSectionContainer from "../../Comment/MediaSection/MediaSectionContainer";
import ReactionButtonContainer from "../../Comment/ReactionButton";
import { UsernameWithPopoverContainer } from "../../Comment/Username";

import styles from "./AnsweredCommentContainer.css";

interface Props {
  viewer: ViewerData | null;
  comment: CommentData;
  story: StoryData;
  settings: SettingsData;
  setCommentID: SetCommentIDMutation;
}

const AnsweredCommentContainer: FunctionComponent<Props> = (props) => {
  const { comment, settings, story, viewer, setCommentID } = props;
  const banned = Boolean(
    viewer && viewer.status.current.includes(GQLUSER_STATUS.BANNED)
  );
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
    [setCommentID, comment]
  );

  return (
    <>
      {comment.parent && (
        <CommentContainer
          viewer={props.viewer}
          settings={props.settings}
          comment={comment.parent}
          story={props.story}
          hideAnsweredTag
          hideReportButton
          hideModerationCarat
          disableReplies
          highlight
        />
      )}
      <div
        className={cn(CLASSES.featuredComment.$root, styles.root)}
        data-testid={`featuredComment-${comment.id}`}
      >
        <Flex
          direction="row"
          alignItems="center"
          mt={4}
          className={CLASSES.featuredComment.authorBar.$root}
        >
          {comment.author && (
            <UsernameWithPopoverContainer
              className={cn(
                CLASSES.featuredComment.authorBar.username,
                styles.username
              )}
              comment={comment}
              viewer={viewer}
              settings={settings}
            />
          )}
          <Flex alignItems="flex-start" justifyContent="center">
            <UserTagsContainer
              className={CLASSES.featuredComment.authorBar.userTag}
              story={story}
              comment={comment}
              settings={settings}
            />
            <Timestamp
              className={cn(
                CLASSES.featuredComment.authorBar.timestamp,
                styles.timestamp
              )}
            >
              {comment.createdAt}
            </Timestamp>
          </Flex>
        </Flex>
        <HTMLContent className={CLASSES.featuredComment.content}>
          {comment.body || ""}
        </HTMLContent>
        <MediaSectionContainer
          comment={comment}
          settings={settings}
          defaultExpanded={viewer?.mediaSettings?.unfurlEmbeds}
        />
        <Flex
          justifyContent="space-between"
          mt={2}
          className={CLASSES.featuredComment.actionBar.$root}
        >
          <ReactionButtonContainer
            comment={comment}
            settings={settings}
            viewer={viewer}
            readOnly={banned}
            className={CLASSES.featuredComment.actionBar.reactButton}
            reactedClassName={CLASSES.featuredComment.actionBar.reactedButton}
            isQA
          />
          <Flex alignItems="center">
            {comment.replyCount > 0 && (
              <Flex alignItems="center" className={styles.replies}>
                <Flex
                  alignItems="center"
                  className={CLASSES.featuredComment.actionBar.replies}
                >
                  <Icon size="md">reply</Icon>
                  <Localized id="comments-featured-replies">
                    <span className={styles.repliesText}>Replies</span>
                  </Localized>
                  <span>{comment.replyCount}</span>
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
                href={getURLWithCommentID(story.url, comment.id)}
              >
                <Localized id="comments-featured-gotoConversation">
                  <span>Go to Conversation</span>
                </Localized>
                <span className={styles.gotoArrow}>&gt;</span>
              </TextLink>
            </div>
          </Flex>
        </Flex>
      </div>
    </>
  );
};

const enhanced = withSetCommentIDMutation(
  withFragmentContainer<Props>({
    viewer: graphql`
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
      }
    `,
    story: graphql`
      fragment AnsweredCommentContainer_story on Story {
        url
        ...UserTagsContainer_story
        ...CommentContainer_story
      }
    `,
    comment: graphql`
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
      }
    `,
    settings: graphql`
      fragment AnsweredCommentContainer_settings on Settings {
        ...ReactionButtonContainer_settings
        ...UserTagsContainer_settings
        ...CommentContainer_settings
        ...MediaSectionContainer_settings
        ...UsernameWithPopoverContainer_settings
      }
    `,
  })(AnsweredCommentContainer)
);

export default enhanced;
