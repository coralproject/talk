import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { BaseButton, ButtonIcon, Flex } from "coral-ui/components/v2";

import CLASSES from "coral-stream/classes";
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
}

const IndentedComment: FunctionComponent<IndentedCommentProps> = (props) => {
  const {
    staticTopBarRight,
    staticUsername,
    indentLevel,
    toggleCollapsed,
    ...rest
  } = props;
  const CommentToggleElement = (
    <CommentToggle
      {...rest}
      toggleCollapsed={toggleCollapsed}
      username={staticUsername}
      topBarRight={staticTopBarRight}
    />
  );
  const CommentElement = <Comment {...rest} />;
  const CommentwithIndent = (
    <Indent
      level={indentLevel}
      collapsed={rest.collapsed}
      className={cn(
        {
          [styles.open]: !rest.collapsed,
          [styles.blur]: props.blur,
          [CLASSES.comment.collapseToggle.collapsed]: rest.collapsed,
        },
        CLASSES.comment.collapseToggle.indent
      )}
    >
      {rest.collapsed ? (
        CommentToggleElement
      ) : (
        <Flex alignItems="flex-start" spacing={1}>
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
                className={cn(styles.icon, CLASSES.comment.collapseToggle.icon)}
              >
                remove
              </ButtonIcon>
            </BaseButton>
          </Localized>
          {CommentElement}
        </Flex>
      )}
    </Indent>
  );
  return CommentwithIndent;
};

export default IndentedComment;
