export function getCommentType(comment) {
  let commentType = '';
  if (comment.status === 'PREMOD') {
    commentType = 'premod';
  } else if (comment.actions && comment.actions.some((a) => a.__typename === 'FlagAction')) {
    commentType = 'flagged';
  }
  return commentType;
}
