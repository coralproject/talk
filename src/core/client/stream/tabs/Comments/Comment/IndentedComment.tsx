import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";

import Indent from "../Indent";
import Comment from "./Comment";

import styles from "./IndentedComment.css";

export interface IndentedCommentProps
  extends Omit<PropTypesOf<typeof Comment>, "ref"> {
  indentLevel?: number;
  blur?: boolean;
}

const IndentedComment: FunctionComponent<IndentedCommentProps> = (props) => {
  const { indentLevel, ...rest } = props;
  const CommentElement = <Comment {...rest} />;
  const CommentwithIndent = (
    <Indent level={indentLevel} className={cn({ [styles.blur]: props.blur })}>
      {CommentElement}
    </Indent>
  );
  return CommentwithIndent;
};

export default IndentedComment;
