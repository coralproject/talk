const client = require('prom-client');

const loggedInUsersCounter = new client.Counter({
  name: 'comments_logged_in_users_total_count',
  help: 'Logged in users total count'
});

const loggedOutUsersCounter = new client.Counter({
  name: 'comments_logged_out_users_total_count',
  help: 'Logged out users total count'
});

const loggedInAnonymousUsersCounter = new client.Counter({
  name: 'comments_logged_in_anonymous_users_total_count',
  help: 'Logged in anonymous users total count'
});

module.exports = {
  loggedInUsersCounter,
  loggedOutUsersCounter,
  loggedInAnonymousUsersCounter
};
