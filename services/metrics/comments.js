const client = require('prom-client');

const commentsTotalCount = new client.Gauge({
  name: 'comments_comments_total_count',
  help: 'Comments total count'
});

const acceptedCommentsCount = new client.Gauge({
  name: 'comments_accepted_comments_count',
  help: 'Accepted comments count'
});

const rejectedCommentsCount = new client.Gauge({
  name: 'comments_rejected_comments_count',
  help: 'Rejected comments count'
});

module.exports = {
  commentsTotalCount,
  acceptedCommentsCount,
  rejectedCommentsCount
};
