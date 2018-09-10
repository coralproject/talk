import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";

import Indent from "../Indent";
import Comment from "./Comment";

export interface IndentedCommentProps extends PropTypesOf<typeof Comment> {
  indentLevel?: number;
}

const IndentedComment: StatelessComponent<IndentedCommentProps> = props => {
  const { indentLevel, ...rest } = props;
  const CommentElement = <Comment {...rest} />;
  const CommentwithIndent =
    (indentLevel && <Indent level={indentLevel}>{CommentElement}</Indent>) ||
    CommentElement;
  return CommentwithIndent;
};

export default IndentedComment;
