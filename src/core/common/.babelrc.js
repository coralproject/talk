if (process.env.WEBPACK === "true") {
  module.exports = require("./.babelrc.client.js");
} else {
  module.exports = require("./.babelrc.server.js");
}
