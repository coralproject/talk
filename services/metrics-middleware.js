const {
  commentTotalCounter,
  commentReplyTotalCounter,
  acceptedCommentsTotalCounter,
  rejectedCommentsTotalCounter,
  featuredCommentsTotalCounter,
  unfeaturedCommentsTotalCounter
} = require('./metrics/comments');
const {loggedInUsersGauge} = require('./metrics/users');

function metricsMiddleware(req, res, next) {

  const {url, method, body = {}} = req;
  const {operationName, variables} = body;

  const isAnonymousUserLogInAction = url === '/api/v1/auth/anonymous' && method === 'GET';
  const isUserLogInAction = url === '/api/v1/auth/local' && method === 'POST';
  const isUserLogOutAction = url === '/api/v1/auth' && method === 'DELETE';

  // user logs in
  (isUserLogInAction || isAnonymousUserLogInAction) && loggedInUsersGauge.inc();

  // user logs out
  isUserLogOutAction && loggedInUsersGauge.dec();

  if (!operationName || !variables) {
    next();
    return;
  }

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

  next();
}

module.exports = metricsMiddleware;
