const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('./redis');

//==============================================================================
// SESSION MIDDLEWARE
//==============================================================================

const session_opts = {
  secret: process.env.TALK_SESSION_SECRET,
  httpOnly: true,
  rolling: true,
  saveUninitialized: true,
  resave: true,
  unset: 'destroy',
  name: 'talk.sid',
  cookie: {
    secure: false,
    maxAge: 8.64e+7, // 24 hours for session token expiry
  },
  store: new RedisStore({
    client: redis.createClient(),
  })
};

if (process.env.NODE_ENV === 'production') {

  // Enable the secure cookie when we are in production mode.
  session_opts.cookie.secure = true;
} else if (process.env.NODE_ENV === 'test') {

  // Add in the secret during tests.
  session_opts.secret = 'keyboard cat';
}

module.exports = session(session_opts);
