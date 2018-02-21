const marked = require('marked');

module.exports = {
  Comment: {
    body: comment => marked(comment.body),
  },
};
