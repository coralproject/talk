import cn from "classnames";
import { isUndefined } from "lodash";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
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
      className={cn({
        [styles.open]: !rest.collapsed,
        [styles.topLevelComment]: isUndefined(indentLevel),
        [styles.blur]: props.blur,
        [styles.collapsed]: rest.collapsed,
      })}
    >
      {rest.collapsed ? (
        CommentToggleElement
      ) : (
        <Flex alignItems="flex-start" spacing={1}>
          <BaseButton onClick={toggleCollapsed} className={styles.toggleButton}>
            <ButtonIcon className={styles.icon}>remove</ButtonIcon>
          </BaseButton>
          {CommentElement}
        </Flex>
      )}
    </Indent>
  );
  return CommentwithIndent;
};

export default IndentedComment;
