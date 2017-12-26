const client = require('prom-client');

const usersTotalCount = new client.Gauge({
  name: 'comments_total_users_count',
  help: 'Users total count'
});

const anonymousUsersCount = new client.Gauge({
  name: 'comments_anonymous_users_count',
  help: 'Anonymous users count'
});

module.exports = {
  usersTotalCount,
  anonymousUsersCount
};
