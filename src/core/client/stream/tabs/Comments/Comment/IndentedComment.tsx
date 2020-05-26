import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { BaseButton, ButtonIcon, Flex } from "coral-ui/components/v2";

import Indent from "../Indent";
import Comment from "./Comment";

import styles from "./IndentedComment.css";

export interface IndentedCommentProps
  extends Omit<PropTypesOf<typeof Comment>, "ref"> {
  indentLevel?: number;
  blur?: boolean;
  toggleCollapsed?: () => void;
}

const IndentedComment: FunctionComponent<IndentedCommentProps> = (props) => {
  const { indentLevel, toggleCollapsed, ...rest } = props;
  const CommentElement = <Comment {...rest} />;
  const CommentwithIndent = (
    <Indent level={indentLevel} className={cn({ [styles.blur]: props.blur })}>
      <Flex alignItems="flex-start">
        <BaseButton onClick={toggleCollapsed}>
          {rest.collapsed ? (
            <ButtonIcon>add</ButtonIcon>
          ) : (
            <ButtonIcon>remove</ButtonIcon>
          )}
        </BaseButton>
        {CommentElement}
      </Flex>
    </Indent>
  );
  return CommentwithIndent;
};

export default IndentedComment;
