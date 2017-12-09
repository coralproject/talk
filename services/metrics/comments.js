const client = require('prom-client');

const commentTotalCounter = new client.Counter({
  name: 'comments_comments_total_count',
  help: 'Comments total count'
});

const commentReplyTotalCounter = new client.Counter({
  name: 'comments_replies_total_count',
  help: 'Comments replies total count'
});

const acceptedCommentsTotalCounter = new client.Counter({
  name: 'comments_accepted_comments_total_count',
  help: 'Accepted comments total count'
});

const rejectedCommentsTotalCounter = new client.Counter({
  name: 'comments_rejected_comments_total_count',
  help: 'Rejected comments total count'
});

const featuredCommentsTotalCounter = new client.Counter({
  name: 'comments_featured_comments_total_count',
  help: 'Featured comments total count'
});

const unfeaturedCommentsTotalCounter = new client.Counter({
  name: 'comments_unfeatured_comments_total_count',
  help: 'Unfeatured comments total count'
});

module.exports = {
  commentTotalCounter,
  commentReplyTotalCounter,
  acceptedCommentsTotalCounter,
  rejectedCommentsTotalCounter,
  featuredCommentsTotalCounter,
  unfeaturedCommentsTotalCounter
};
