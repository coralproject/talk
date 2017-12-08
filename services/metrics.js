const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({timeout: 5000});

const commentTotalCounter = new client.Counter({
  name: 'comments_comment_total_count',
  help: 'Comments total count'
});

const commentReplyTotalCounter = new client.Counter({
  name: 'comments_comment_reply_total_count',
  help: 'Comments replies total count'
});

const acceptedCommentsTotalCounter = new client.Counter({
  name: 'comments_accepted_comment_total_count',
  help: 'Accepted comments total count'
});

const rejectedCommentsTotalCounter = new client.Counter({
  name: 'comments_rejected_comment_total_count',
  help: 'Rejected comments total count'
});

const featuredCommentsTotalCounter = new client.Counter({
  name: 'comments_featured_comment_total_count',
  help: 'Featured comments total count'
});

const unfeaturedCommentsTotalCounter = new client.Counter({
  name: 'comments_unfeatured_comment_total_count',
  help: 'Unfeatured comments total count'
});

const loggedInUsersCounter = new client.Counter({
  name: 'comments_logged_in_users_total_count',
  help: 'Logged in users total count'
});

const loggedOutUsersCounter = new client.Counter({
  name: 'comments_logged_out_users_total_count',
  help: 'Logged out users total count'
});

if (process.env.BUILD_NUMBER) {

  const releaseVersion = new client.Gauge({
    name: 'comments_release_version',
    help: 'Release version',
    labelNames: ['commit_hash']
  });

  releaseVersion.set({commit_hash: ''}, process.env.BUILD_NUMBER);
}

module.exports = ({url, method, body: {operationName, variables} = {}} = {}) => {

  const isUserLogInAction = url === '/api/v1/auth/local' && method === 'POST';
  const isUserLogOutAction = url === '/api/v1/auth' && method === 'DELETE';

  // user logs in
  isUserLogInAction && loggedInUsersCounter.inc();

  // user logs out
  isUserLogOutAction && loggedOutUsersCounter.inc();

  if (!operationName || !variables) {return;}

  // user posts a comment
  const isPostCommentAction = operationName === 'PostComment';

  // users posts a comment reply
  const isReplyCommentAction = isPostCommentAction && variables.input && variables.input.parent_id;

  // moderator accepts comment
  const isAcceptCommentAction = operationName === 'SetCommentStatus' && variables.status === 'ACCEPTED';

  // moderator rejects comment
  const isRejectCommentAction = operationName === 'SetCommentStatus' && variables.status === 'REJECTED';

  // moderator features comment
  const isFeatureCommentAction = operationName === 'AddTag' && variables.name === 'FEATURED';

  // moderator unfeatures comment
  const isUnfeatureCommentAction = operationName === 'RemoveTag' && variables.status === 'FEATURED';

  isPostCommentAction && commentTotalCounter.inc();
  isAcceptCommentAction && acceptedCommentsTotalCounter.inc();
  isRejectCommentAction && rejectedCommentsTotalCounter.inc();
  isFeatureCommentAction && featuredCommentsTotalCounter.inc();
  isUnfeatureCommentAction && unfeaturedCommentsTotalCounter.inc();
  isReplyCommentAction && commentReplyTotalCounter.inc();
};
