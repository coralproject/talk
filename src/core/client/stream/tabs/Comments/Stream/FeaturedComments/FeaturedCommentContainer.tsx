import cn from "classnames";
import { Localized } from "fluent-react/compat";
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
import { Box, Flex, Icon, TextLink } from "coral-ui/components";

import { FeaturedCommentContainer_comment as CommentData } from "coral-stream/__generated__/FeaturedCommentContainer_comment.graphql";
import { FeaturedCommentContainer_settings as SettingsData } from "coral-stream/__generated__/FeaturedCommentContainer_settings.graphql";
import { FeaturedCommentContainer_story as StoryData } from "coral-stream/__generated__/FeaturedCommentContainer_story.graphql";
import { FeaturedCommentContainer_viewer as ViewerData } from "coral-stream/__generated__/FeaturedCommentContainer_viewer.graphql";

import { UserTagsContainer } from "../../Comment";
import ReactionButtonContainer from "../../Comment/ReactionButton";
import { UsernameWithPopoverContainer } from "../../Comment/Username";

import styles from "./FeaturedCommentContainer.css";

interface Props {
  viewer: ViewerData | null;
  comment: CommentData;
  story: StoryData;
  settings: SettingsData;
  setCommentID: SetCommentIDMutation;
}

const FeaturedCommentContainer: FunctionComponent<Props> = props => {
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
      setCommentID({ id: comment.id });
      return false;
    },
    [setCommentID, comment]
  );

  return (
    <div
      className={cn(CLASSES.featuredComment.$root, styles.root)}
      data-testid={`featuredComment-${comment.id}`}
    >
      <HTMLContent className={CLASSES.featuredComment.content}>
        {comment.body || ""}
      </HTMLContent>
      <Flex
        direction="row"
        alignItems="center"
        mt={4}
        className={CLASSES.featuredComment.authorBar.$root}
      >
        {comment.author && (
          <UsernameWithPopoverContainer
            className={CLASSES.featuredComment.authorBar.username}
            comment={comment}
            viewer={viewer}
          />
        )}
        <Box ml={1} container="span">
          <UserTagsContainer
            className={CLASSES.featuredComment.authorBar.userTag}
            comment={comment}
            settings={settings}
          />
        </Box>
        <Box ml={2} clone>
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
          readOnly={banned}
          className={CLASSES.featuredComment.actionBar.reactButton}
          reactedClassName={CLASSES.featuredComment.actionBar.reactedButton}
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
                  <Box mx={1}>Replies</Box>
                </Localized>
                <Box>{comment.replyCount}</Box>
              </Flex>
              <Box mx={2}>|</Box>
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
  );
};

const enhanced = withSetCommentIDMutation(
  withFragmentContainer<Props>({
    viewer: graphql`
      fragment FeaturedCommentContainer_viewer on User {
        id
        status {
          current
        }
        ignoredUsers {
          id
        }
        role
        ...UsernameWithPopoverContainer_viewer
        ...ReactionButtonContainer_viewer
      }
    `,
    story: graphql`
      fragment FeaturedCommentContainer_story on Story {
        url
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
        body
        createdAt
        lastViewerAction
        replyCount
        ...UsernameWithPopoverContainer_comment
        ...ReactionButtonContainer_comment
        ...UserTagsContainer_comment
      }
    `,
    settings: graphql`
      fragment FeaturedCommentContainer_settings on Settings {
        ...ReactionButtonContainer_settings
        ...UserTagsContainer_settings
      }
    `,
  })(FeaturedCommentContainer)
);

export default enhanced;
