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

export function denormalizeAsset(asset: any) {
  const commentNodes =
    (asset.comments &&
      asset.comments.edges.map((edge: any) => denormalizeComment(edge))) ||
    [];
  const commentsPageInfo = (asset.comments && asset.comments.pageInfo) || {
    endCursor: null,
    hasNextPage: false,
  };
  return {
    ...asset,
    comments: { edges: commentNodes, pageInfo: commentsPageInfo },
    commentCounts: {
      totalVisible: commentNodes.length,
    },
  };
}

export function denormalizeAssets(assetList: any[]) {
  return assetList.map(a => denormalizeAsset(a));
}
