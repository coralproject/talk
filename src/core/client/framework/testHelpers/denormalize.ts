export function denormalizeComment(comment: any, parents: any[] = []) {
  const replyNodes =
    (comment.replies &&
      comment.replies.edges.map((edge: any) =>
        denormalizeComment(edge, [...parents, comment])
      )) ||
    [];
  const repliesPageInfo = (comment.replies && comment.replies.pageInfo) || {
    endCursor: null,
    hasNextPage: false,
  };
  return {
    ...comment,
    replies: { edges: replyNodes, pageInfo: repliesPageInfo },
    replyCount: replyNodes.length,
    parentCount: parents.length,
    parents: {
      edges: parents,
      pageInfo: { startCursor: null, hasPreviousPage: false },
    },
  };
}

export function denormalizeComments(commentList: any[]) {
  return commentList.map(c => denormalizeComment(c));
}

export function denormalizeStory(story: any) {
  const commentNodes =
    (story.comments &&
      story.comments.edges.map((edge: any) => ({
        ...edge,
        node: denormalizeComment(edge.node),
      }))) ||
    [];
  const commentsPageInfo = (story.comments && story.comments.pageInfo) || {
    endCursor: null,
    hasNextPage: false,
  };
  return {
    ...story,
    comments: { edges: commentNodes, pageInfo: commentsPageInfo },
    commentCounts: {
      totalVisible: commentNodes.length,
    },
  };
}

export function denormalizeStories(storyList: any[]) {
  return storyList.map(a => denormalizeStory(a));
}
