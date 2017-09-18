const {
  RECAPTCHA_PUBLIC,
  WEBSOCKET_LIVE_URI,
} = require('../config');
const {
  STATIC_URL,
} = require('../url');

module.exports.data = {
  TALK_RECAPTCHA_PUBLIC: RECAPTCHA_PUBLIC,
  LIVE_URI: WEBSOCKET_LIVE_URI,
  STATIC_URL,
};
