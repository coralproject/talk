import {
  GQLComment,
  GQLCommentEdge,
  GQLStory,
  GQLTAG,
  GQLTag,
} from "coral-framework/schema";

import createFixture, { Fixture } from "./createFixture";

export function denormalizeComment(
  comment: Fixture<GQLComment>,
  parents: Array<Fixture<GQLCommentEdge>> = []
): GQLComment {
  const replyEdges =
    (comment.replies &&
      comment.replies.edges &&
      comment.replies.edges.map(edge => ({
        ...edge,
        node:
          edge.node &&
          denormalizeComment(edge.node, [
            ...parents,
            { node: comment, cursor: comment.createdAt },
          ]),
      }))) ||
    [];
  const repliesPageInfo = (comment.replies && comment.replies.pageInfo) || {
    endCursor: null,
    hasNextPage: false,
  };
  return createFixture<GQLComment>({
    ...comment,
    replies: { edges: replyEdges, pageInfo: repliesPageInfo },
    replyCount: replyEdges.length,
    parentCount: parents.length,
    parents: {
      edges: parents,
      pageInfo: { startCursor: null, hasPreviousPage: false },
    },
  });
}

export function denormalizeComments(commentList: Array<Fixture<GQLComment>>) {
  return commentList.map(c => denormalizeComment(c));
}

export function denormalizeStory(story: Fixture<GQLStory>) {
  const commentNodes =
    (story.comments &&
      story.comments.edges &&
      story.comments.edges.map((edge: any) => ({
        ...edge,
        node: denormalizeComment(edge.node),
      }))) ||
    [];
  const commentsPageInfo = (story.comments && story.comments.pageInfo) || {
    endCursor: null,
    hasNextPage: false,
  };
  const featuredCommentsCount = commentNodes.filter(
    n => n.tags && n.tags.some((t: GQLTag) => t.code === GQLTAG.FEATURED)
  ).length;
  return createFixture<GQLStory>({
    ...story,
    comments: { edges: commentNodes, pageInfo: commentsPageInfo },
    commentCounts: {
      ...story.commentCounts,
      totalVisible: commentNodes.length,
      tags: {
        ...(story.commentCounts && story.commentCounts.tags),
        FEATURED: featuredCommentsCount,
      },
    },
  });
}

export function denormalizeStories(storyList: Array<Fixture<GQLStory>>) {
  return storyList.map(a => denormalizeStory(a));
}
