const client = require('prom-client');

const loggedInUsersGauge = new client.Gauge({
  name: 'comments_logged_in_users_count',
  help: 'Logged in users count gauge'
});

module.exports = {
  loggedInUsersGauge
};
