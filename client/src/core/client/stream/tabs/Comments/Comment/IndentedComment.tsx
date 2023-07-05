import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { BaseButton, ButtonIcon, Flex } from "coral-ui/components/v2";

import Indent from "../Indent";
import Comment, { CommentProps } from "./Comment";
import CommentToggle from "./CommentToggle";

import styles from "./IndentedComment.css";

export interface IndentedCommentProps extends Omit<CommentProps, "ref"> {
  classNameIndented?: string;
  indentLevel?: number;
  blur?: boolean;
  toggleCollapsed?: () => void;
  staticUsername: React.ReactNode;
  staticTopBarRight: React.ReactNode;
  tags?: React.ReactNode | null;
  badges?: React.ReactNode | null;
  enableJumpToParent?: boolean;
  username?: string | null;
}

const IndentedComment: FunctionComponent<IndentedCommentProps> = ({
  staticTopBarRight,
  staticUsername,
  indentLevel,
  toggleCollapsed,
  blur,
  classNameIndented,
  ...rest
}) => {
  const collapseCommentsLocalizationId = rest.username
    ? "comments-collapse-toggle-with-username"
    : "comments-collapse-toggle-without-username";
  return (
    <Indent
      level={indentLevel}
      collapsed={rest.collapsed}
      className={cn(
        {
          [styles.blur]: blur,
          [CLASSES.comment.collapseToggle.collapsed]: rest.collapsed,
        },
        CLASSES.comment.collapseToggle.indent
      )}
      classNameIndent={classNameIndented}
    >
      {rest.collapsed ? (
        <CommentToggle
          {...rest}
          toggleCollapsed={toggleCollapsed}
          usernameEl={staticUsername}
          username={rest.username}
          topBarRight={staticTopBarRight}
        />
      ) : (
        <Flex alignItems="flex-start" spacing={1}>
          {toggleCollapsed && (
            <Localized
              id={collapseCommentsLocalizationId}
              attrs={{ "aria-label": true }}
              vars={{ username: rest.username }}
            >
              <BaseButton
                onClick={toggleCollapsed}
                aria-label={`Hide comment by ${rest.username} and its replies`}
                className={cn(
                  styles.toggleButton,
                  CLASSES.comment.collapseToggle.$root
                )}
              >
                <ButtonIcon
                  className={cn(
                    styles.icon,
                    CLASSES.comment.collapseToggle.icon
                  )}
                >
                  remove
                </ButtonIcon>
              </BaseButton>
            </Localized>
          )}
          <Comment {...rest} />
        </Flex>
      )}
    </Indent>
  );
};

export default IndentedComment;
