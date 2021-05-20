import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "relay-runtime";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import HTMLContent from "coral-stream/common/HTMLContent";
import { UserTagsContainer } from "coral-stream/tabs/Comments/Comment";
import AuthorBadges from "coral-stream/tabs/Comments/Comment/AuthorBadges";
import { UsernameWithPopoverContainer } from "coral-stream/tabs/Comments/Comment/Username";
import { Flex, Icon, MatchMedia, Timestamp } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveCommentAvatarAndBodyContainer_comment } from "coral-stream/__generated__/LiveCommentAvatarAndBodyContainer_comment.graphql";
import { LiveCommentAvatarAndBodyContainer_settings } from "coral-stream/__generated__/LiveCommentAvatarAndBodyContainer_settings.graphql";
import { LiveCommentAvatarAndBodyContainer_story } from "coral-stream/__generated__/LiveCommentAvatarAndBodyContainer_story.graphql";
import { LiveCommentAvatarAndBodyContainer_viewer } from "coral-stream/__generated__/LiveCommentAvatarAndBodyContainer_viewer.graphql";

import LiveMediaSectionContainer from "../LiveMedia/LiveMediaSectionContainer";

import styles from "./LiveCommentAvatarAndBodyContainer.css";

interface Props {
  story: LiveCommentAvatarAndBodyContainer_story;
  comment: LiveCommentAvatarAndBodyContainer_comment;
  settings: LiveCommentAvatarAndBodyContainer_settings;
  viewer: LiveCommentAvatarAndBodyContainer_viewer | null;

  containerClassName?: string;
  onCancel?: () => void;

  truncateBody?: boolean;
  mediaMode?: "default" | "mini";
}

const LiveCommentAvatarAndBodyContainer: FunctionComponent<Props> = ({
  story,
  comment,
  settings,
  viewer,
  containerClassName,
  onCancel,
  truncateBody,
  mediaMode = "default",
}) => {
  return (
    <Flex justifyContent="flex-start" alignItems="flex-start">
      {comment.author && comment.author.avatar ? (
        <img
          src={comment.author.avatar}
          className={styles.avatar}
          loading="lazy"
          referrerPolicy="no-referrer"
          alt={`Avatar for ${comment.author.username}`}
        />
      ) : (
        <div className={cn(styles.avatar, styles.emptyAvatar)}>
          <Icon className={styles.avatarIcon}>person</Icon>
        </div>
      )}
      <div className={cn(styles.container, containerClassName)}>
        <div className={styles.headerRoot}>
          <Flex
            justifyContent="flex-start"
            alignItems="center"
            className={styles.header}
          >
            {comment.author && viewer && (
              <UsernameWithPopoverContainer
                className={styles.username}
                usernameClassName={styles.username}
                comment={comment}
                viewer={viewer}
                settings={settings}
              />
            )}
            {comment.author && !viewer && (
              <div className={styles.username}>{comment.author?.username}</div>
            )}
            <UserTagsContainer
              story={story}
              comment={comment}
              settings={settings}
              tagClassName={styles.tag}
            />
            {comment.author && comment.author.badges && (
              <AuthorBadges
                badges={comment.author.badges}
                className={styles.badge}
              />
            )}
            <Timestamp className={styles.timestamp}>
              {comment.createdAt}
            </Timestamp>
            {comment.editing.edited && (
              <Localized id="liveChat-editedMarker-edited">
                <span className={styles.edited}>(Edited)</span>
              </Localized>
            )}
          </Flex>
          {onCancel && (
            <Button
              className={styles.cancelButton}
              variant="none"
              onClick={onCancel}
              paddingSize="extraSmall"
            >
              <Flex justifyContent="flex-start" alignItems="center">
                <Icon
                  className={styles.cancelIcon}
                  aria-label="Read conversation"
                >
                  cancel
                </Icon>
                <MatchMedia gteWidth="mobile">
                  <span className={styles.cancelText}>Cancel</span>
                </MatchMedia>
              </Flex>
            </Button>
          )}
        </div>

        <div
          className={cn({
            [styles.truncatedBody]: truncateBody,
          })}
        >
          <HTMLContent className={cn(styles.body, CLASSES.comment.content)}>
            {comment.body || ""}
          </HTMLContent>
          <LiveMediaSectionContainer
            comment={comment}
            settings={settings}
            defaultExpanded={true}
            mode={mediaMode}
          />
        </div>
      </div>
    </Flex>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveCommentAvatarAndBodyContainer_story on Story {
      id
      ...UserTagsContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveCommentAvatarAndBodyContainer_viewer on User {
      id
      ...UsernameWithPopoverContainer_viewer
    }
  `,
  comment: graphql`
    fragment LiveCommentAvatarAndBodyContainer_comment on Comment {
      id
      createdAt
      body
      author {
        id
        username
        avatar
        badges
      }
      editing {
        edited
      }
      ...UsernameWithPopoverContainer_comment
      ...UserTagsContainer_comment
      ...LiveMediaSectionContainer_comment
    }
  `,
  settings: graphql`
    fragment LiveCommentAvatarAndBodyContainer_settings on Settings {
      ...ReportFlowContainer_settings
      ...LiveCommentActionsContainer_settings
      ...UsernameWithPopoverContainer_settings
      ...UserTagsContainer_settings
      ...LiveMediaSectionContainer_settings
    }
  `,
})(LiveCommentAvatarAndBodyContainer);

export default enhanced;
