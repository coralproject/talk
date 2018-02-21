import React from 'react';
import { name } from '../../package.json';

const CommentContent = ({ comment }) => {
  return comment.htmlBody ? (
    <div
      className={`${name}-text`}
      dangerouslySetInnerHTML={{ __html: comment.htmlBody }}
    />
  ) : (
    <div className={`${name}-text`}>{comment.body}</div>
  );
};

export default CommentContent;
