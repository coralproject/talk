import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { BaseButton, ButtonIcon, Flex } from "coral-ui/components/v2";

import Indent from "../Indent";
import Comment from "./Comment";
import CommentToggle from "./CommentToggle";

import styles from "./IndentedComment.css";

export interface IndentedCommentProps
  extends Omit<PropTypesOf<typeof Comment>, "ref"> {
  indentLevel?: number;
  blur?: boolean;
  toggleCollapsed?: () => void;
  staticUsername: React.ReactNode;
  staticTopBarRight: React.ReactNode;
  tags?: React.ReactNode | null;
  badges?: React.ReactNode | null;
}

const IndentedComment: FunctionComponent<IndentedCommentProps> = ({
  staticTopBarRight,
  staticUsername,
  indentLevel,
  toggleCollapsed,
  blur,
  ...rest
}) => {
  return (
    <Indent
      level={indentLevel}
      collapsed={rest.collapsed}
      className={cn(
        {
          [styles.open]: !rest.collapsed,
          [styles.blur]: blur,
          [CLASSES.comment.collapseToggle.collapsed]: rest.collapsed,
        },
        CLASSES.comment.collapseToggle.indent
      )}
    >
      {rest.collapsed ? (
        <CommentToggle
          {...rest}
          toggleCollapsed={toggleCollapsed}
          username={staticUsername}
          topBarRight={staticTopBarRight}
        />
      ) : (
        <Flex alignItems="baseline" spacing={1}>
          {toggleCollapsed && (
            <Localized
              id="comments-collapse-toggle"
              attrs={{ "aria-label": true }}
            >
              <BaseButton
                onClick={toggleCollapsed}
                aria-label="Collapse comment thread"
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
